// src/lib/auth-middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function checkAuth(request: NextRequest) {
  // Get token from cookie (matching your middleware cookie name)
  const galaxyCookie = request.cookies.get('galaxy-admin-session')?.value;
  const adminTokenCookie = request.cookies.get('adminToken')?.value;
  
  // Get the expected token from environment or hardcoded
  const expectedToken = process.env.ADMIN_TOKEN || 'd3a165840e65153fc24bf57c1228c1d927e16f2ff5122e72e2612b073d9749e2';
  
  // Check if either cookie matches
  if (galaxyCookie === expectedToken || adminTokenCookie === expectedToken) {
    return null; // Auth passed
  }
  
  // Also check Authorization header as fallback
  const authHeader = request.headers.get('Authorization');
  const headerToken = authHeader?.replace('Bearer ', '');
  
  if (headerToken === expectedToken) {
    return null; // Auth passed
  }
  
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}