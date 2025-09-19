import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// Request size limits
const MAX_REQUEST_SIZE = 256; // Small request for this endpoint

// Rate limiting for instance creation
const createAttempts = new Map();
const MAX_CREATE_ATTEMPTS = 3;
const LOCKOUT_DURATION = 0; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = `create_${ip}`;
  
  if (!createAttempts.has(key)) {   
    createAttempts.set(key, { count: 1, resetTime: now + LOCKOUT_DURATION });
    return true;
  }

  const record = createAttempts.get(key);
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + LOCKOUT_DURATION;
    return true;
  }

  if (record.count >= MAX_CREATE_ATTEMPTS) {
    return false;
  }

  record.count++;
  return true;
}

function generateCredentials() {
  // Generate 10-digit numerical username
  const username = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  
  // Generate 10-character alphanumeric password
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return { username, password };
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
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Apply rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many creation attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Get MongoDB connection details from environment
    const mongoUrl = process.env.MONGO_LOGIN;
    const mongoDatabase = process.env.MONGO_DATABASE;
    const mongoCollection = process.env.MONGO_COLLECTION;

    if (!mongoUrl || !mongoDatabase || !mongoCollection) {
      console.error('MongoDB environment variables not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Connect to MongoDB
    const client = new MongoClient(mongoUrl);
    
    try {
      await client.connect();
      const db = client.db(mongoDatabase);
      const collection = db.collection(mongoCollection);

      // Check if any admin instances already exist
      const existingCount = await collection.countDocuments();
      
      if (existingCount > 0) {
        return NextResponse.json(
          { error: 'An admin instance is already created' },
          { status: 409 }
        );
      }

      // Generate new credentials
      const { username, password } = generateCredentials();
      
      // Hash password for storage
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create admin instance document
      const instanceDoc = {
        username,
        password: hashedPassword,
        type: 'admin',
        createdAt: new Date(),
        createdFrom: ip,
        status: 'active'
      };

      // Insert the admin instance
      const result = await collection.insertOne(instanceDoc);

      if (result.acknowledged) {
        return NextResponse.json(
          { 
            success: true,
            credentials: {
              username,
              password // Return plain password for display
            }
          },
          { status: 201 }
        );
      } else {
        throw new Error('Failed to create admin instance');
      }

    } finally {
      await client.close();
    }

  } catch (error) {
    console.error('Instance creation error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
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
