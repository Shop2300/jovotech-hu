// src/app/api/admin/auth/route.ts
import { NextResponse } from 'next/server';

// Simple auth - in production, use proper authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Create response with cookie
    const response = NextResponse.json({ success: true });
    
    // Set admin token cookie (in production, use proper JWT)
    response.cookies.set('admin-token', process.env.ADMIN_TOKEN || 'admin-authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// Logout endpoint
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin-token');
  return response;
}