// src/app/api/admin/auth/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { AUTH_CONFIG } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Use hardcoded values from auth.ts as fallback
    const adminPassword = process.env.ADMIN_PASSWORD || AUTH_CONFIG.ADMIN_PASSWORD;
    const adminToken = process.env.ADMIN_TOKEN || AUTH_CONFIG.ADMIN_TOKEN;
    
    if (!adminPassword || !adminToken) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    let isValid = false;
    
    // Check if adminPassword looks like a bcrypt hash (starts with $2)
    if (adminPassword.startsWith('$2')) {
      // It's a hash, use bcrypt compare
      isValid = await bcrypt.compare(password, adminPassword);
    } else {
      // It's plain text (for development), compare directly
      isValid = password === adminPassword;
    }
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Return the token so the client can store it
    const response = NextResponse.json({ 
      success: true,
      token: adminToken 
    });
    
    // Also set as httpOnly cookie
    response.cookies.set('adminToken', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    // IMPORTANT: Also set the galaxy-admin-session cookie that middleware expects
    response.cookies.set('galaxy-admin-session', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
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