import fetch from 'node-fetch';
import jwkToPem from 'jwk-to-pem';

let cachedKeys = null;

export async function getPublicKeyFromJWKS(token) {
  if (!cachedKeys) {
    const jwksUri = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
    const res = await fetch(jwksUri);
    const { keys } = await res.json();
    cachedKeys = keys;
  }

  // Decode token header to get kid
  const { header } = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString('utf-8'));
  const kid = header.kid;

  const key = cachedKeys.find(k => k.kid === kid);
  if (!key) {
    throw new Error('Public key not found in JWKS');
  }

  const pem = jwkToPem(key);

  return pem;
}
