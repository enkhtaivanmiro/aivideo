import { NextResponse } from 'next/server';
import { jwtVerify, importJWK } from 'jose';

const COGNITO_REGION = process.env.COGNITO_REGION;
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const APP_CLIENT_ID = process.env.COGNITO_APP_CLIENT_ID;
const JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;

let cachedJWKS = null;

// Fetch JWKS once and cache
async function getJWKS() {
  if (!cachedJWKS) {
    const res = await fetch(JWKS_URL);
    const jwks = await res.json();
    cachedJWKS = jwks.keys;
  }
  return cachedJWKS;
}

// Get the public key by `kid` from JWT header
async function getKey(kid) {
  const keys = await getJWKS();
  const jwk = keys.find(k => k.kid === kid);
  if (!jwk) throw new Error('Public key not found in JWKS');
  return await importJWK(jwk, jwk.alg || 'RS256');
}

// Verify the token
async function verifyToken(token) {
  try {
    const { kid } = JSON.parse(atob(token.split('.')[0]));
    const key = await getKey(kid);

    const { payload } = await jwtVerify(token, key, {
      issuer: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}`,
      audience: APP_CLIENT_ID,
    });

    return payload; // if valid
  } catch (err) {
    console.error('[Middleware] Token verification failed:', err.message);
    return null;
  }
}

// Main middleware logic
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value || null;

  const isPublic = ['/login', '/signup'].some(path => pathname.startsWith(path));
  const isProtected = ['/home', '/upload', '/profile', '/settings'].some(path => pathname.startsWith(path));

  const isValid = token && await verifyToken(token);

  // Handle public routes: redirect to /home if already logged in
  if (isPublic) {
    if (isValid) {
      return NextResponse.redirect(new URL('/home', req.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes: redirect to /login if not logged in
  if (isProtected) {
    if (!isValid) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  // Default: allow
  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/login', '/signup', '/upload'],
};
