// src/app/api/admin/auth/route.ts
import { NextResponse } from 'next/server';
import { AUTH_CONFIG } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Check if password matches
    if (password !== AUTH_CONFIG.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Create response with success
    const response = NextResponse.json({ success: true });
    
    // Set secure admin session cookie
    response.cookies.set(AUTH_CONFIG.COOKIE_NAME, AUTH_CONFIG.ADMIN_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      maxAge: AUTH_CONFIG.COOKIE_MAX_AGE,
      path: '/', // Ensure cookie is available for all paths
    });
    
    return response;
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
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_CONFIG.COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // This will delete the cookie
    path: '/',
  });
  return response;
}

// Check auth status endpoint
export async function GET() {
  // This endpoint can be used to check if user is authenticated
  return NextResponse.json({ authenticated: true });
}
