import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET /auth/callback — handles OAuth (Google), magic link, email confirmation,
// and password recovery callbacks from Supabase.
//
// Routing decision tree:
//   1. Exchange code for session
//   2. If recovery flow (next=/reset-password) → go to /reset-password
//   3. Check onboarding_completed in DB
//   4. If not completed → /onboarding (ignoring `next` param to prevent bypasses)
//   5. If completed → `next` param or /dashboard
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('[auth/callback] code exchange error:', error.message);
        return NextResponse.redirect(
          new URL('/login?error=auth_callback_failed', requestUrl.origin)
        );
      }

      if (data.user) {
        // Password recovery flow — always honor the /reset-password destination.
        // The user is authenticated via the recovery token and needs to set a new password.
        if (next === '/reset-password') {
          return NextResponse.redirect(new URL('/reset-password', requestUrl.origin));
        }

        // Check onboarding status from the database (server-authoritative, not client state)
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('onboarding_completed')
          .eq('id', data.user.id)
          .single();

        // If profile doesn't exist yet or onboarding is not completed,
        // ALWAYS route to /onboarding — regardless of `next` param.
        // This prevents bypasses via crafted callback URLs.
        if (!profile?.onboarding_completed) {
          return NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
        }

        // Onboarding complete — go to the requested page or dashboard.
        // Only allow internal paths (prevent open redirect).
        if (next && next.startsWith('/') && !next.startsWith('//')) {
          return NextResponse.redirect(new URL(next, requestUrl.origin));
        }

        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
      }
    } catch (err) {
      console.error('[auth/callback] unexpected error:', err);
    }
  }

  // Fallback — send to login on error
  return NextResponse.redirect(
    new URL('/login?error=auth_callback_failed', requestUrl.origin)
  );
}
