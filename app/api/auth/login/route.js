import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { serialize } from 'cookie';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    const session = await new Promise((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: (session) => resolve(session),
        onFailure: (err) => reject(err),
      });
    });

    const idToken = session.getIdToken().getJwtToken();
    const accessToken = session.getAccessToken().getJwtToken();
    const refreshToken = session.getRefreshToken().getToken();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    const cookies = [
      serialize('idToken', idToken, cookieOptions),
      serialize('accessToken', accessToken, cookieOptions),
      serialize('refreshToken', refreshToken, cookieOptions),
    ];

    return new Response(JSON.stringify({ message: 'Logged in successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookies.join('; '),
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: error.message || 'Login failed' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
