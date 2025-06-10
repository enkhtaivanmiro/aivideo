import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { userPool } from '@/lib/cognito';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    const session = await new Promise((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: resolve,
        onFailure: reject,
      });
    });

    const token = session.getIdToken().getJwtToken();

    cookies().set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return new Response(JSON.stringify({ message: 'Logged in successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: error.message || 'Login failed' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
