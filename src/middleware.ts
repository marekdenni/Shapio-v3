import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware — protects app routes and redirects authenticated users away from auth pages
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  const isAppRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/plan') ||
    pathname.startsWith('/coach') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/progress') ||
    pathname.startsWith('/nutrition');

  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register');

  // Redirect unauthenticated users away from protected routes
  if (isAppRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)'],
};
