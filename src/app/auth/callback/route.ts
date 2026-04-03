import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET /auth/callback — handles OAuth (Google) and magic link callbacks
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user has completed onboarding to decide where to redirect
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('id', data.user.id)
        .single();

      // If next param is explicitly set (e.g. from email confirmation), use it
      if (next) {
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }

      // Route based on onboarding status
      const destination = profile?.onboarding_completed ? '/dashboard' : '/onboarding';
      return NextResponse.redirect(new URL(destination, requestUrl.origin));
    }
  }

  // Fallback — send to login on error
  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', requestUrl.origin));
}
