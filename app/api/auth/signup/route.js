import { userPool } from '@/lib/cognito';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    const user = await new Promise((resolve, reject) => {
      userPool.signUp(email, password, [], null, (err, result) => {
        if (err) {
          console.error('Signup error:', err);
          return reject(err);
        }
        resolve(result.user);
      });
    });

    return new Response(JSON.stringify({ message: 'User created', username: user.getUsername() }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error?.message || 'Internal Server Error';
    const status = message.includes('already exists') ? 409 : 500;

    return new Response(JSON.stringify({ message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
