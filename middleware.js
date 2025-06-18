import { NextResponse } from 'next/server';
import { jwtVerify, importJWK } from 'jose';

const COGNITO_REGION = process.env.COGNITO_REGION;
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;

let cachedJWK;
async function getPublicKey() {
  if (!cachedJWK) {
    const res = await fetch(JWKS_URL);
    const jwks = await res.json();
    cachedJWK = await importJWK(jwks.keys[0], 'RS256');
  }
  return cachedJWK;
}

export async function middleware(req) {
  console.log('All cookies:', req.cookies.getAll());
  
  const cognitoIdToken = req.cookies.get('CognitoIdentityServiceProvider.2e3iko2tmgo88146l0sqb0nenm.b714aab8-b081-7061-45c7-a4e7b090f343.idToken')?.value;
  const token = req.cookies.get('token')?.value || cognitoIdToken;
  console.log('token value:', token);
  
  const altToken = req.cookies.get('idToken')?.value ||
                   req.cookies.get('accessToken')?.value ||
                   req.cookies.get('id_token')?.value;
  
  console.log('Alternative tokens:', altToken);
  
  const url = req.nextUrl.clone();

  if (!token && !altToken) {
    console.log('No token found, redirecting to not-authorized');
    url.pathname = '/not-authorized';
    return NextResponse.redirect(url);
  }

  try {
    const publicKey = await getPublicKey();
    const { payload } = await jwtVerify(token || altToken, publicKey);
    
    const groups = payload['cognito:groups'] || [];
    console.log('User groups:', groups);

    if (groups.includes('Admin')) {
      return NextResponse.next();
    } else {
      url.pathname = '/not-authorized';
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.log("jwt verification failed");
    console.error('JWT verification failed:', err);
    url.pathname = '/not-authorized';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/admin'],
};