import { serialize } from 'cookie';

export async function POST() {
  const headers = new Headers();

  headers.append('Set-Cookie', serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    expires: new Date(0),
    sameSite: 'strict',
    path: '/',
  }));

  return new Response(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
    headers,
  });
}
