'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, signInWithGoogle } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  // Email confirmation required state
  const [confirmationSent, setConfirmationSent] = useState(false);

  const selectedPlan = searchParams.get('plan');

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Jméno je povinné.';
    if (!email.trim()) newErrors.email = 'E-mail je povinný.';
    if (!password) newErrors.password = 'Heslo je povinné.';
    else if (password.length < 6) newErrors.password = 'Heslo musí mít alespoň 6 znaků.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await signUp(email, password, name);
    setIsSubmitting(false);

    if (result.error) {
      if (result.error.includes('registrován')) {
        setErrors({ email: result.error });
      } else {
        setErrors({ general: result.error });
      }
      return;
    }

    if (result.needsConfirmation) {
      // Supabase requires email confirmation — show message instead of redirecting
      setConfirmationSent(true);
      return;
    }

    // Auto-confirmed (email confirmation disabled in Supabase)
    router.push('/onboarding');
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    setErrors({});
    const { error } = await signInWithGoogle();
    if (error) {
      setErrors({ general: error });
      setIsGoogleLoading(false);
    }
    // Redirect happens via OAuth — no further action
  };

  // Email confirmation sent screen
  if (confirmationSent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-[#1D1D22] border border-[#2A2A31] rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
          📧
        </div>
        <h1 className="text-2xl font-black text-[#F5F5F5] mb-3">Potvrď svůj e-mail</h1>
        <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">
          Poslali jsme ti potvrzovací odkaz na{' '}
          <span className="text-[#F5F5F5] font-medium">{email}</span>.
          <br />
          Klikni na odkaz v e-mailu a poté se přihlas.
        </p>
        <p className="text-xs text-[#A1A1AA]/60 mb-6">
          Pokud e-mail nevidíš, zkontroluj složku se spamem.
        </p>
        <Link
          href="/login"
          className="inline-block w-full py-3.5 bg-[#B3263E] hover:bg-[#D13A52] text-white font-bold rounded-xl transition-all duration-200 text-center"
        >
          Přejít na přihlášení
        </Link>
        <button
          onClick={() => setConfirmationSent(false)}
          className="mt-3 text-sm text-[#A1A1AA]/60 hover:text-[#A1A1AA] transition-colors"
        >
          ← Zpět
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-black text-[#F5F5F5] mb-2">Vytvoř si účet</h1>
        <p className="text-[#A1A1AA] text-sm">
          {selectedPlan
            ? `Registruj se a pokračuj k plánu ${selectedPlan.toUpperCase()}`
            : 'Začni svou transformaci ještě dnes.'}
        </p>
      </div>

      {errors.general && (
        <div className="mb-5 p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-sm text-red-400">
          {errors.general}
        </div>
      )}

      {/* Google first — easier for users */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={isGoogleLoading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#1D1D22] border border-[#2A2A31] hover:border-[#B3263E]/50 rounded-xl text-sm text-[#F5F5F5] font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mb-4"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {isGoogleLoading ? 'Přesměrovávám...' : 'Pokračovat přes Google'}
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-[#2A2A31]" />
        <span className="text-xs text-[#A1A1AA]/60">nebo e-mailem</span>
        <div className="flex-1 h-px bg-[#2A2A31]" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#F5F5F5]">Jméno</label>
          <input
            type="text"
            placeholder="Jan Novák"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={`px-4 py-3 bg-[#1D1D22] text-[#F5F5F5] border rounded-xl placeholder:text-[#A1A1AA]/50 focus:outline-none focus:ring-2 focus:ring-[#B3263E]/40 focus:border-[#B3263E]/60 transition-all duration-200 ${errors.name ? 'border-red-600' : 'border-[#2A2A31]'}`}
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#F5F5F5]">E-mail</label>
          <input
            type="email"
            placeholder="tvuj@email.cz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={`px-4 py-3 bg-[#1D1D22] text-[#F5F5F5] border rounded-xl placeholder:text-[#A1A1AA]/50 focus:outline-none focus:ring-2 focus:ring-[#B3263E]/40 focus:border-[#B3263E]/60 transition-all duration-200 ${errors.email ? 'border-red-600' : 'border-[#2A2A31]'}`}
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#F5F5F5]">Heslo</label>
          <input
            type="password"
            placeholder="Alespoň 6 znaků"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className={`px-4 py-3 bg-[#1D1D22] text-[#F5F5F5] border rounded-xl placeholder:text-[#A1A1AA]/50 focus:outline-none focus:ring-2 focus:ring-[#B3263E]/40 focus:border-[#B3263E]/60 transition-all duration-200 ${errors.password ? 'border-red-600' : 'border-[#2A2A31]'}`}
          />
          {errors.password
            ? <p className="text-xs text-red-400">{errors.password}</p>
            : <p className="text-xs text-[#A1A1AA]/60">Minimum 6 znaků</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-[#B3263E] hover:bg-[#D13A52] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(179,38,62,0.4)] active:scale-[0.98] mt-1"
        >
          {isSubmitting ? 'Vytvářím účet...' : 'Vytvořit účet'}
        </button>
      </form>

      <p className="text-xs text-[#A1A1AA]/60 text-center mt-4 leading-relaxed">
        Registrací souhlasíš s{' '}
        <Link href="/podminky-pouziti" className="text-[#A1A1AA]/80 hover:text-[#A1A1AA] underline underline-offset-2 transition-colors">
          Podmínkami použití
        </Link>{' '}
        a{' '}
        <Link href="/ochrana-osobnich-udaju" className="text-[#A1A1AA]/80 hover:text-[#A1A1AA] underline underline-offset-2 transition-colors">
          Ochranou osobních údajů
        </Link>.
      </p>

      <p className="text-center text-sm text-[#A1A1AA] mt-5">
        Již máš účet?{' '}
        <Link href="/login" className="text-[#B3263E] hover:text-[#D13A52] font-semibold transition-colors">
          Přihlásit se
        </Link>
      </p>
    </div>
  );
}
