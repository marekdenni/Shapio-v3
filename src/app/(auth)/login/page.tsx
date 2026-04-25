'use client';

// Login page — přihlášení do getbeter s email/heslo + Google OAuth
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

// Inner component that uses useSearchParams (requires Suspense boundary)
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle, loading } = useAuthStore();
  // Used to read profile state after signIn resolves
  const getState = useAuthStore.getState;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  /**
   * Resolves the post-login destination:
   * 1. If profile onboarding is incomplete → /onboarding
   * 2. If middleware set ?redirect=<path> → that path (validated)
   * 3. Default → /dashboard
   */
  const resolveRedirect = (): string => {
    const { profile } = getState();

    // Onboarding takes priority — don't let a redirect param bypass it
    if (profile?.onboardingCompleted === false) {
      return '/onboarding';
    }

    // Honor the redirect param if present and safe
    const redirect = searchParams.get('redirect');
    if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
      return redirect;
    }

    return '/dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) { setError('E-mail je povinný.'); return; }
    if (!password) { setError('Heslo je povinné.'); return; }

    setIsSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setIsSubmitting(false);

    if (signInError) {
      setError(signInError);
      return;
    }

    // Profile is loaded after signIn resolves — route intelligently
    router.push(resolveRedirect());
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    setError(null);

    // Pass the intended destination so the auth callback can route the user
    // back where they came from after Google OAuth completes.
    const redirect = searchParams.get('redirect');
    const next = redirect && redirect.startsWith('/') && !redirect.startsWith('//')
      ? redirect
      : undefined;

    const { error: googleError } = await signInWithGoogle(next);
    if (googleError) {
      setError(googleError);
      setIsGoogleLoading(false);
    }
    // Redirect happens via OAuth flow — no further action needed
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-black text-[#F5F5F5] mb-2">
          Přihlásit se do getbeter
        </h1>
        <p className="text-[#A1A1AA] text-sm">
          Vítej zpět! Zadej své přihlašovací údaje.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-5 p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-sm text-red-400 animate-fade-in-up">
          {error}
        </div>
      )}

      {/* Auth callback error display */}
      {searchParams.get('error') === 'auth_callback_failed' && !error && (
        <div className="mb-5 p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-sm text-red-400 animate-fade-in-up">
          Přihlášení selhalo. Zkus to prosím znovu.
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#F5F5F5]">E-mail</label>
          <input
            type="email"
            placeholder="tvuj@email.cz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="px-4 py-3 bg-[#1D1D22] text-[#F5F5F5] border border-[#2A2A31] rounded-xl placeholder:text-[#A1A1AA]/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 focus:border-[#3B82F6]/60 transition-all duration-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#F5F5F5]">Heslo</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="px-4 py-3 bg-[#1D1D22] text-[#F5F5F5] border border-[#2A2A31] rounded-xl placeholder:text-[#A1A1AA]/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 focus:border-[#3B82F6]/60 transition-all duration-200"
          />
        </div>

        {/* Forgot password */}
        <div className="flex justify-end -mt-2">
          <Link
            href="/forgot-password"
            className="text-xs text-[#A1A1AA]/70 hover:text-[#A1A1AA] transition-colors"
          >
            Zapomenuté heslo?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full py-3.5 bg-[#3B82F6] hover:bg-[#7C3AED] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-[0.98] mt-1"
        >
          {isSubmitting ? 'Přihlašuji...' : 'Přihlásit se'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[#2A2A31]" />
        <span className="text-xs text-[#A1A1AA]/60">nebo</span>
        <div className="flex-1 h-px bg-[#2A2A31]" />
      </div>

      {/* Google OAuth button */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={isGoogleLoading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#1D1D22] border border-[#2A2A31] hover:border-[#3B82F6]/50 rounded-xl text-sm text-[#F5F5F5] font-medium transition-all duration-200 hover:bg-[#1D1D22]/80 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {/* Google icon SVG */}
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {isGoogleLoading ? 'Přesměrovávám...' : 'Pokračovat přes Google'}
      </button>

      {/* Register link */}
      <p className="text-center text-sm text-[#A1A1AA] mt-6">
        Nemáš účet?{' '}
        <Link
          href="/register"
          className="text-[#3B82F6] hover:text-[#7C3AED] font-semibold transition-colors"
        >
          Zaregistruj se
        </Link>
      </p>
    </div>
  );
}

// Main export wrapped in Suspense for useSearchParams
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-[#A1A1AA] text-center p-10">Načítání...</div>}>
      <LoginForm />
    </Suspense>
  );
}
