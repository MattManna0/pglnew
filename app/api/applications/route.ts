import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// Rate limiting store (in production, use Redis or similar)
const rateLimitMap = new Map();

// Simple rate limiting function
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // max 5 requests per window

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  const record = rateLimitMap.get(ip);
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Request size limits (bytes)
const MAX_REQUEST_SIZE = 1024; // 1KB - sufficient for form data
const MAX_FIELD_LENGTH = {
  name: 100,
  email: 100,
  phone: 20
};

// Input validation (no XSS sanitization - handle on render)
function validateInput(data: unknown) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid input data');
  }

  const { name, email, phone } = data as { name: string; email: string; phone: string };

  // Validate required fields
  if (!name || !email || !phone) {
    throw new Error('All fields are required');
  }

  // Type validation
  if (typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string') {
    throw new Error('Invalid field types');
  }

  // Length validation
  if (name.length > MAX_FIELD_LENGTH.name || 
      email.length > MAX_FIELD_LENGTH.email || 
      phone.length > MAX_FIELD_LENGTH.phone) {
    throw new Error('Field length exceeds maximum allowed');
  }

  // Basic normalization (trim whitespace, normalize email case)
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim();

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw new Error('Invalid email format');
  }

  // Phone validation (basic format check)
  const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{0,19}$/;
  if (!phoneRegex.test(normalizedPhone)) {
    throw new Error('Invalid phone number format');
  }

  return {
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check request size limit
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { error: 'Request payload too large' },
        { status: 413 }
      );
    }

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Apply rate limiting
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body with size validation
    const rawBody = await request.text();
    if (rawBody.length > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { error: 'Request payload too large' },
        { status: 413 }
      );
    }

    // Parse JSON and validate input
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    const validatedData = validateInput(body);

    // Get MongoDB connection string from environment
    const mongoUrl = process.env.MONGO_LOGIN;
    if (!mongoUrl) {
      console.error('MONGO_LOGIN environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get MongoDB database and collection from environment
    const mongoDatabase = process.env.MONGO_DATABASE;
    const mongoCollectionName = process.env.MONGO_APPLICATIONS_COLLECTION;

    // Connect to MongoDB
    const client = new MongoClient(mongoUrl);
    
    try {
      await client.connect();
      if (!mongoDatabase) {
        throw new Error('MONGO_DATABASE environment variable not set');
      }
      if (!mongoCollectionName) {
        throw new Error('MONGO_APPLICATIONS_COLLECTION environment variable not set');
      }
      const db = client.db(mongoDatabase!);
      const collection = db.collection(mongoCollectionName!);

      // Check for duplicate email (basic duplicate prevention)
      const existingApplication = await collection.findOne({ email: validatedData.email });
      if (existingApplication) {
        return NextResponse.json(
          { error: 'An application with this email already exists' },
          { status: 409 }
        );
      }

      // Hash sensitive data (phone number) for additional security
      const hashedPhone = await bcrypt.hash(validatedData.phone, 10);

      // Prepare document for insertion
      const applicationDoc = {
        name: validatedData.name,
        email: validatedData.email,
        phone: hashedPhone, // Store hashed phone for security
        phoneDisplay: validatedData.phone.slice(0, 3) + '***' + validatedData.phone.slice(-2), // Partial display
        submittedAt: new Date(),
        submittedFrom: ip,
        status: 'pending'
      };

      // Insert the application
      const result = await collection.insertOne(applicationDoc);

      if (result.acknowledged) {
        return NextResponse.json(
          { 
            message: 'Application submitted successfully',
            applicationId: result.insertedId 
          },
          { status: 201 }
        );
      } else {
        throw new Error('Failed to insert application');
      }

    } finally {
      await client.close();
    }

  } catch (error) {
    console.error('Application submission error:', error);
    
    // Return appropriate error response
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
