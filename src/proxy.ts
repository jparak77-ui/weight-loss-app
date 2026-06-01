import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  // Zkontroluj Firebase UID cookie
  const uid = request.cookies.get('firebase-uid')?.value;
  const isLoggedIn = !!uid && uid.length > 10;

  if (!isLoggedIn && !isPublic && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|api).*)'],
};
