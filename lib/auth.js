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

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, async (header) => {
      if (!header.kid) throw new Error('Token header missing kid');
      return getKey(header.kid);
    }, {
      issuer: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}`,
      audience: process.env.COGNITO_APP_CLIENT_ID,
    });
    return payload;
  } catch (err) {
    throw new Error('Token invalid or expired');
  }
}
