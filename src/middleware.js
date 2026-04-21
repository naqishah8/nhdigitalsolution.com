import { NextResponse } from 'next/server';
import { verifySessionValue, SESSION_COOKIE } from '@/lib/auth';

// Guards /careers/admin (everything except /careers/admin/login).
// Redirects unauthenticated users to the login page.
export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/careers/admin')) {
    if (pathname === '/careers/admin/login') return NextResponse.next();
    const cookie = req.cookies.get(SESSION_COOKIE)?.value;
    const ok = await verifySessionValue(cookie);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = '/careers/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/careers/admin/:path*'],
};
