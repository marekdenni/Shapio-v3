'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('E-mail je povinný.');
      return;
    }

    setIsSubmitting(true);
    const { error: resetError } = await resetPassword(email.trim());
    setIsSubmitting(false);

    if (resetError) {
      setError(resetError);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-surface2 border border-border rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
          📧
        </div>
        <h1 className="text-2xl font-black text-text-primary mb-3">Zkontroluj e-mail</h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          Poslali jsme odkaz pro obnovení hesla na{' '}
          <span className="text-text-primary font-medium">{email}</span>.
          <br />
          Klikni na odkaz v e-mailu — platí 1 hodinu.
        </p>
        <p className="text-xs text-text-secondary/60 mb-6">
          E-mail nevidíš? Zkontroluj složku Spam nebo Hromadné zprávy.
        </p>
        <Link
          href="/login"
          className="inline-block w-full py-3.5 bg-cta hover:bg-highlight text-white font-bold rounded-xl transition-all duration-200 text-center hover:shadow-glow-blue active:scale-[0.98]"
        >
          Zpět na přihlášení
        </Link>
        <button
          onClick={() => { setSent(false); setEmail(''); }}
          className="mt-3 text-sm text-text-secondary/60 hover:text-text-secondary transition-colors"
        >
          Zadat jiný e-mail
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-black text-text-primary mb-2">Zapomenuté heslo</h1>
        <p className="text-text-secondary text-sm">
          Zadej svůj e-mail a pošleme ti odkaz pro obnovení hesla.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-sm text-red-400 animate-fade-in-up">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">E-mail</label>
          <input
            type="email"
            placeholder="tvuj@email.cz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
            className="px-4 py-3 bg-surface2 text-text-primary border border-border rounded-xl placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-cta/40 focus:border-cta/60 transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-cta hover:bg-highlight disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 hover:shadow-glow-blue active:scale-[0.98]"
        >
          {isSubmitting ? 'Odesílám...' : 'Odeslat odkaz'}
        </button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        Vzpomněl sis?{' '}
        <Link
          href="/login"
          className="text-cta hover:text-highlight font-semibold transition-colors"
        >
          Přihlásit se
        </Link>
      </p>
    </div>
  );
}
