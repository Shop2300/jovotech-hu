// src/app/api/admin/auth/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Use the same constants as middleware
const ADMIN_TOKEN = 'd3a165840e65153fc24bf57c1228c1d927e16f2ff5122e72e2612b073d9749e2';
const ADMIN_PASSWORD = 'O87TJpfbh2qtUqvzTGc0KjkioE2jZCGA';
const COOKIE_NAME = 'galaxy-admin-session';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    console.log('Login attempt:', { 
      providedPassword: password,
      expectedPassword: ADMIN_PASSWORD,
      matches: password === ADMIN_PASSWORD 
    });
    
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Get cookies store with await (Next.js 15 requirement)
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, ADMIN_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Authentication successful' 
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Logout endpoint
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ success: true });
}

// Check auth status endpoint
export async function GET() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get(COOKIE_NAME);
  
  const isAuthenticated = adminSession?.value === ADMIN_TOKEN;
  
  return NextResponse.json({ 
    authenticated: isAuthenticated,
    hasSession: !!adminSession 
  });
}
