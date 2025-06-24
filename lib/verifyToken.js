import { jwtVerify, importJWK } from 'jose';

let cachedJWKS = null;

async function fetchJWKS() {
  if (!cachedJWKS) {
    const url = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch JWKS');
    const { keys } = await res.json();
    cachedJWKS = keys;
  }
  return cachedJWKS;
}

async function getKey(kid) {
  const jwks = await fetchJWKS();
  const jwk = jwks.find(key => key.kid === kid);
  if (!jwk) throw new Error('Public key not found in JWKS');
  return importJWK(jwk, jwk.alg || 'RS256');
}

export async function verifyToken(token) {
  try {
    if (!token) throw new Error('Token is required');

    const [headerEncoded] = token.split('.');
    const headerJson = Buffer.from(headerEncoded, 'base64').toString('utf-8');
    const header = JSON.parse(headerJson);
    if (!header.kid) throw new Error('Token header missing kid');

    const key = await getKey(header.kid);

    const { payload } = await jwtVerify(token, key, {
      issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
      audience: process.env.COGNITO_APP_CLIENT_ID,
    });

    return payload;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}
