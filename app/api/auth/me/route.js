import jwt from 'jsonwebtoken';

export async function GET(req) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader
      .split('; ')
      .map(cookie => {
        const [name, ...rest] = cookie.split('=');
        return [name, rest.join('=')];
      })
  );

  const token = cookies.token;

  if (!token) {
    return new Response(JSON.stringify({ user: null }), { status: 401 });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ user: null }), { status: 401 });
  }
}
