import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

export async function verifyAdminAccess(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authorized: false, error: 'No valid token provided' };
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = await verifyToken(token);
    
    const groups = decoded['cognito:groups'] || [];
    
    if (!groups.includes('Admin')) {
      return { authorized: false, error: 'Insufficient permissions - Admin access required' };
    }

    return { authorized: true, user: decoded };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { authorized: false, error: 'Authentication failed' };
  }
}

export async function verifyAdminAccessSimple(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authorized: false, error: 'No valid token provided' };
    }

    const token = authHeader.replace('Bearer ', '');
    
    const decoded = jwt.decode(token);
    
    if (!decoded) {
      return { authorized: false, error: 'Invalid token' };
    }

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return { authorized: false, error: 'Token expired' };
    }

    const groups = decoded['cognito:groups'] || [];
    
    if (!groups.includes('Admin')) {
      return { authorized: false, error: 'Insufficient permissions - Admin access required' };
    }

    return { authorized: true, user: decoded };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { authorized: false, error: 'Authentication failed' };
  }
}