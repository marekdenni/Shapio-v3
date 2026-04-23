import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware — protects app routes and redirects authenticated users away from auth pages.
// Uses getUser() for server-verified auth (not getSession() which only reads local storage).
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // getUser() makes a server call to verify the JWT — more reliable than getSession()
  // which only reads from cookies/localStorage without validation.
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  // Protected app routes — require authentication
  const isAppRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/plan') ||
    pathname.startsWith('/coach') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/progress') ||
    pathname.startsWith('/nutrition') ||
    pathname.startsWith('/org');

  // Auth routes — should redirect away if already authenticated
  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register');

  // Password reset page is special: user arrives via a recovery link that sets a session.
  // Do NOT redirect them away from /reset-password — they need to set their new password.
  const isResetPassword =
    pathname === '/reset-password' ||
    pathname.startsWith('/reset-password');

  // Redirect unauthenticated users away from protected routes
  if (isAppRoute && !user) {
    const loginUrl = new URL('/login', req.url);
    // Preserve the intended destination for post-login redirect
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages (except reset-password)
  if (isAuthRoute && !isResetPassword && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)'],
};
