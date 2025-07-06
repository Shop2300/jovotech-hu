// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the admin token directly here to avoid env variable issues
const ADMIN_TOKEN = 'd3a165840e65153fc24bf57c1228c1d927e16f2ff5122e72e2612b073d9749e2';
const COOKIE_NAME = 'galaxy-admin-session';

export function middleware(request: NextRequest) {
  // Only check admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page and auth API
    if (
      request.nextUrl.pathname === '/admin/login' ||
      request.nextUrl.pathname.startsWith('/api/admin/auth')
    ) {
      return NextResponse.next();
    }

    // Check for admin session cookie
    const adminSession = request.cookies.get(COOKIE_NAME);
    
    if (!adminSession || adminSession.value !== ADMIN_TOKEN) {
      // Redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};