import { NextResponse } from 'next/server';
import { jwtVerify, importJWK } from 'jose';

const COGNITO_REGION = process.env.COGNITO_REGION;
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;

let cachedJWKS;

async function getJWKS() {
  if (!cachedJWKS) {
    const res = await fetch(JWKS_URL);
    cachedJWKS = await res.json();
  }
  return cachedJWKS;
}

export async function middleware(req) {
  console.log('hit here')
  const token = 'eyJraWQiOiIyQW1idHZEajRcL0VTUlFyXC83V2t2cU9UbGJzVHp5NGRERVwvN0NVbmtndlZnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0N2M0OGE2OC1lMDExLTcwNjUtZGZlZC00Y2MyNjhlNzFjYmIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtbm9ydGhlYXN0LTFfMjZCR0ZhTjVFIiwiY2xpZW50X2lkIjoiMTM0OTdlOG51dTh2Z24wdGxsb3EybjRnOWYiLCJvcmlnaW5fanRpIjoiYjkzMWNiNGMtZmZjMC00MTBmLTgyMWYtNDFiOGY1NWUxNzZkIiwiZXZlbnRfaWQiOiJiYTgyMDY5Yy0zMjYyLTQzMmItOWI1Ni1hZTI5MTY2MTQ5MzYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzQ5NDM5Mjg1LCJleHAiOjE3NDk0NDI4ODUsImlhdCI6MTc0OTQzOTI4NSwianRpIjoiYzhlYWIxNjYtNGVlNC00Y2YyLTg4MzktYzU3NjhjYmY4OTZmIiwidXNlcm5hbWUiOiJlbmh0YWl2YW5ieWFtYmFqYXYxNDgzIn0.Nqw5NS3tpHb7AMwFE1mWMSliIPxw9XhNT-5SmwvTKlpiswQL2g-TkfPcNebnkLbF9Cg36Xuz0_eLg7pVMaCQzXIpkluRH9t8rxqVop3l0W8A0JDtCK3KrAbMdZMl6ZxSwHQPgDIiH7eBMMLszObMg03LWKEbMGpT_oddxoOP8ijU9AZhOgS44kkeZO8DysENbZnRuVJSysRxcGNrqbDYnnabLawBQ-4jDwltM76ly3iMSpnXzMmtPWBl4jagVt3aOxZrqBebxFk0WZh_GvjBPDWXM2Hx024nMW5j-Nbn5P3e62PGrMZjSKreEKjk1mI9wMMI_BGqt2dxlidUKtc3FA'
  const url = req.nextUrl.clone();

console.log(token)
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    const jwks = await getJWKS();
    const publicKey = await importJWK(jwks.keys[0], 'RS256');

    const { payload } = await jwtVerify(token, publicKey);
    const groups = payload['cognito:groups'] || [];
    console.log('groups')

    if (groups.includes('Admin')) {
      return NextResponse.next();
    } else {
      url.pathname = '/not-authorized';
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error('JWT verification failed:', error);
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/admin'],
};
