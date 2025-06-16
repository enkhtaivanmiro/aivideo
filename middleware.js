// middleware.js - Simplified for AWS Amplify
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Allow all requests to pass through
  // Authentication will be handled client-side by AuthGuard
  const response = NextResponse.next();
  
  // Add custom headers if needed for debugging
  response.headers.set('x-pathname', pathname);
  
  return response;
}

export const config = {
  matcher: [
    // Match all routes except static assets and API routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)',
  ],
};