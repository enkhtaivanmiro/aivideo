import { jwtVerify, importJWK } from 'jose';

let cachedJWKS = null;

export async function getKey(token) {
  const header = JSON.parse(atob(token.split('.')[0]));
  const kid = header.kid;

  if (!cachedJWKS) {
    const url = `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
    const res = await fetch(url);
    const { keys } = await res.json();
    cachedJWKS = keys;
  }

  const jwk = cachedJWKS.find(k => k.kid === kid);
  if (!jwk) throw new Error('JWK not found');

  return await importJWK(jwk, jwk.alg || 'RS256');
}

export async function verifyToken(token) {
  try {
    const key = await getKey(token);

    const { payload } = await jwtVerify(token, key, {
      issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
      audience: process.env.COGNITO_APP_CLIENT_ID,
    });

    return payload;
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return null;
  }
}
