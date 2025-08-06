// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the admin token directly here to avoid env variable issues
const ADMIN_TOKEN = 'd3a165840e65153fc24bf57c1228c1d927e16f2ff5122e72e2612b073d9749e2';
const COOKIE_NAME = 'galaxy-admin-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle large uploads for the upload route
  if (pathname === '/api/upload') {
    // Clone the response to modify headers
    const response = NextResponse.next();
    // Set headers to allow larger payloads
    response.headers.set('x-middleware-request-size-limit', '50mb');
    return response;
  }

  // Only check admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to login page and auth API
    if (
      pathname === '/admin/login' ||
      pathname.startsWith('/api/admin/auth')
    ) {
      return NextResponse.next();
    }

    // Check for admin session cookie
    const adminSession = request.cookies.get(COOKIE_NAME);
    
    if (!adminSession || adminSession.value !== ADMIN_TOKEN) {
      // Redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect removed admin pages to orders (after authentication check)
    const removedAdminPages = [
      '/admin/banners',
      '/admin/feature-icons',
      '/admin/dashboard'
    ];

    // Check if the current path starts with any removed page path
    const isRemovedPage = removedAdminPages.some(page => 
      pathname === page || pathname.startsWith(`${page}/`)
    );

    if (isRemovedPage) {
      return NextResponse.redirect(new URL('/admin/orders', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/upload'],
};