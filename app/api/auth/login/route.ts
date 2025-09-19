import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Request size limits
const MAX_REQUEST_SIZE = 512; // 512 bytes for login data
const MAX_FIELD_LENGTH = {
  username: 50,
  password: 100
};

// Rate limiting for login attempts
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Simple user store (in production, use proper database)
const users = new Map([
  ['admin', '$2a$10$8K1p/a0dclxKDBqe7BHnNOxWl7BHVRVXjyW3VWRVXjyW3VWRVXjyWe'], // admin123
  ['user', '$2a$10$8K1p/a0dclxKDBqe7BHnNOxWl7BHVRVXjyW3VWRVXjyW3VWRVXjyWu']   // password123
]);

// Initialize user passwords on first request (better approach)
let usersInitialized = false;
async function initializeUsers() {
  if (!usersInitialized) {
    users.set('admin', await bcrypt.hash('admin123', 10));
    users.set('user', await bcrypt.hash('password123', 10));
    usersInitialized = true;
  }
}

function checkRateLimit(ip: string): { allowed: boolean; attemptsLeft: number } {
  const now = Date.now();
  const key = `login_${ip}`;
  
  if (!loginAttempts.has(key)) {
    loginAttempts.set(key, { count: 0, resetTime: now + LOCKOUT_DURATION });
    return { allowed: true, attemptsLeft: MAX_LOGIN_ATTEMPTS };
  }

  const record = loginAttempts.get(key);
  
  // Reset if lockout period expired
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + LOCKOUT_DURATION;
    return { allowed: true, attemptsLeft: MAX_LOGIN_ATTEMPTS };
  }

  const attemptsLeft = MAX_LOGIN_ATTEMPTS - record.count;
  
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    return { allowed: false, attemptsLeft: 0 };
  }

  return { allowed: true, attemptsLeft };
}

function recordFailedAttempt(ip: string): void {
  const key = `login_${ip}`;
  const record = loginAttempts.get(key);
  if (record) {
    record.count++;
  }
}

function validateLoginInput(data: unknown) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid input data');
  }

  const { username, password } = data as { username: string; password: string };

  // Validate required fields
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  // Type validation
  if (typeof username !== 'string' || typeof password !== 'string') {
    throw new Error('Invalid field types');
  }

  // Length validation
  if (username.length > MAX_FIELD_LENGTH.username || 
      password.length > MAX_FIELD_LENGTH.password) {
    throw new Error('Field length exceeds maximum allowed');
  }

  // Basic validation
  if (username.length < 3 || password.length < 6) {
    throw new Error('Username must be at least 3 characters and password at least 6 characters');
  }

  return {
    username: username.trim().toLowerCase(),
    password: password
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

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limiting
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
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

    // Parse JSON
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    // Validate input
    const { username, password } = validateLoginInput(body);

    // Initialize users if not done yet
    await initializeUsers();

    // Simulate processing delay to prevent timing attacks
    const startTime = Date.now();
    
    // Check if user exists and verify password
    const hashedPassword = users.get(username);
    let isValid = false;
    
    if (hashedPassword) {
      isValid = await bcrypt.compare(password, hashedPassword);
    } else {
      // Perform dummy hash comparison to prevent username enumeration
      await bcrypt.compare(password, '$2a$10$dummy.hash.to.prevent.timing.attacks');
    }

    // Ensure minimum processing time (prevent timing attacks)
    const minProcessingTime = 500; // 500ms minimum
    const elapsed = Date.now() - startTime;
    if (elapsed < minProcessingTime) {
      await new Promise(resolve => setTimeout(resolve, minProcessingTime - elapsed));
    }

    if (!isValid) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { 
          error: 'Invalid username or password',
          attemptsLeft: rateLimit.attemptsLeft - 1
        },
        { status: 401 }
      );
    }

    // Success - create session or JWT token here in production
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: { username }
      },
      { status: 200 }
    );

    // Set secure session cookie (in production, use proper session management)
    response.cookies.set('session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    
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
