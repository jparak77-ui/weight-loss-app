import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login'];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isPublic = PUBLIC_ROUTES.some((r) => nextUrl.pathname.startsWith(r));

  // nepřihlášený → login
  if (!isLoggedIn && !isPublic && nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  // přihlášený na login → dashboard
  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|api/auth).*)'],
};
