import { NextResponse } from 'next/server';
import { jwtVerify, importJWK } from 'jose';

const COGNITO_REGION = process.env.COGNITO_REGION;
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;

let cachedJWKS;

async function getJWKS() {
  if (!cachedJWKS) {
    const res = await fetch(JWKS_URL);
    const jwks = await res.json();
    cachedJWKS = jwks.keys;
  }
  return cachedJWKS;
}

async function getKey(kid) {
  const jwks = await getJWKS();
  const key = jwks.find(key => key.kid === kid);
  if (!key) throw new Error('Public key not found in JWKS');
  return importJWK(key);
}

async function verifyToken(token) {
  try {
    await jwtVerify(token, async (header) => {
      if (!header.kid) throw new Error('Token header missing kid');
      return getKey(header.kid);
    }, {
      issuer: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}`,
      audience: process.env.COGNITO_APP_CLIENT_ID,
    });
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get('token')?.value;

  const protectedRoutes = ['/home'];
  const publicRoutes = ['/login', '/signup'];

  // If user tries to access public routes like /login or /signup
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    if (token && await verifyToken(token)) {
      // Logged-in user should not access login/signup, redirect to home
      return NextResponse.redirect(new URL('/home', req.url));
    }
    // No token or invalid token, allow access to login/signup
    return NextResponse.next();
  }

  // If user tries to access protected routes like /home
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token || !(await verifyToken(token))) {
      // No valid token, redirect to login
      return NextResponse.redirect(new URL('/login', req.url));
    }
    // Valid token, allow access
    return NextResponse.next();
  }

  // For other routes, allow access without checks
  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/login', '/signup'],  // Run middleware on protected and public auth pages
};
