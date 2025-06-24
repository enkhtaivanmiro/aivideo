import { serialize } from 'cookie';

export async function POST() {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  };

  const headers = new Headers();
  headers.append('Set-Cookie', serialize('idToken', '', cookieOptions));
  headers.append('Set-Cookie', serialize('accessToken', '', cookieOptions));
  headers.append('Set-Cookie', serialize('token', '', cookieOptions));

  return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
    status: 200,
    headers,
  });
}
