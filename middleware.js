import { NextResponse } from 'next/server';
import { jwtVerify, importJWK } from 'jose';

const COGNITO_REGION = process.env.COGNITO_REGION;
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;

let cachedKey = null;

async function getPublicKey() {
  if (cachedKey) return cachedKey;

  const res = await fetch(JWKS_URL);
  const { keys } = await res.json();
  cachedKey = await importJWK(keys[0], 'RS256');
  return cachedKey;
}

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const token =
    req.cookies.get('idToken')?.value ||
    req.cookies.get('accessToken')?.value;

  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    const publicKey = await getPublicKey();
    const { payload } = await jwtVerify(token, publicKey);
    const groups = payload['cognito:groups'] || [];

    if (groups.includes('Admin')) {
      return NextResponse.next();
    }

    url.pathname = '/not-authorized';
    return NextResponse.redirect(url);
  } catch (err) {
    console.warn('JWT verification failed:', err.code || err.message);

    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
