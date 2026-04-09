// Centralized app configuration — reads from environment variables
// All auth redirect URLs must use getAppUrl(), never hardcoded strings.

/**
 * Returns the application base URL appropriate for the current runtime context.
 *
 * Strategy:
 *  - Client side (browser): uses window.location.origin — always correct at runtime
 *    regardless of what was baked into the bundle at build time. This is the safe
 *    fallback if NEXT_PUBLIC_APP_URL is missing from the Netlify build environment.
 *  - Server side (SSR / API routes): uses process.env.NEXT_PUBLIC_APP_URL, which on
 *    Netlify is read from the runtime environment at request time — correct as long
 *    as the env var is set in Netlify Site Settings → Environment Variables.
 *  - Hard fallback for local dev: http://localhost:3000
 *
 * Usage:
 *   import { getAppUrl } from '@/lib/config';
 *   const url = `${getAppUrl()}/auth/callback`;
 */
export function getAppUrl(): string {
  // Client-side: use the real browser origin (runtime, always accurate)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Server-side: use the env var (set this in Netlify → Site Settings → Environment Variables)
  // TODO: Set NEXT_PUBLIC_APP_URL=https://lovely-flan-3b5c6d.netlify.app in Netlify env vars
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
};
