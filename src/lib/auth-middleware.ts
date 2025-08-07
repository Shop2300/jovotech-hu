// src/lib/auth-middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function checkAuth(request: NextRequest) {
  // Get token from cookie (matching your middleware cookie name)
  const galaxyCookie = request.cookies.get('galaxy-admin-session')?.value;
  const adminTokenCookie = request.cookies.get('adminToken')?.value;
  
  // Get the expected token from environment or hardcoded (UPDATED TOKEN)
  const expectedToken = process.env.ADMIN_TOKEN || '9b47e7c473fa31d73d795a598b8417ec220c14cbc89295a6d68e1d15e79b9733';
  
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