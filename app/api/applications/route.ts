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

// Input validation and sanitization
function validateAndSanitizeInput(data: unknown) {
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
  if (name.length > 100 || email.length > 100 || phone.length > 20) {
    throw new Error('Field length exceeds maximum allowed');
  }

  // Sanitize inputs (remove potential script tags and normalize)
  const sanitizedName = name.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedPhone = phone.trim().replace(/[^\d\+\-\s\(\)]/g, '');

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedEmail)) {
    throw new Error('Invalid email format');
  }

  // Phone validation
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(sanitizedPhone.replace(/[\s\-\(\)]/g, ''))) {
    throw new Error('Invalid phone number format');
  }

  return {
    name: sanitizedName,
    email: sanitizedEmail,
    phone: sanitizedPhone
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Apply rate limiting
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = validateAndSanitizeInput(body);

    // Get MongoDB connection string from environment
    const mongoUrl = process.env.MONGO_LOGIN;
    if (!mongoUrl) {
      console.error('MONGO_LOGIN environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Connect to MongoDB
    const client = new MongoClient(mongoUrl);
    
    try {
      await client.connect();
      const db = client.db('leafWeb');
      const collection = db.collection('applications');

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
