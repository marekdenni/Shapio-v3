'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword, user, loading } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // If user is not authenticated after loading, redirect to forgot-password
  // (the reset link must have already been used or is invalid)
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/forgot-password');
    }
  }, [loading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Heslo je povinné.');
      return;
    }
    if (password.length < 6) {
      setError('Heslo musí mít alespoň 6 znaků.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Hesla se neshodují.');
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await updatePassword(password);
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError);
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 2500);
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-surface2 border border-border rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
          ✅
        </div>
        <h1 className="text-2xl font-black text-text-primary mb-3">Heslo bylo změněno</h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          Tvoje heslo bylo úspěšně aktualizováno. Přesměrovávám tě do aplikace…
        </p>
        <div className="w-full h-1 bg-surface2 rounded-full overflow-hidden">
          <div className="h-full bg-cta rounded-full animate-[loading_2.5s_linear_forwards]" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-black text-text-primary mb-2">Nastavit nové heslo</h1>
        <p className="text-text-secondary text-sm">
          Zadej nové heslo pro svůj účet.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-sm text-red-400 animate-fade-in-up">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">Nové heslo</label>
          <input
            type="password"
            placeholder="Alespoň 6 znaků"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            autoFocus
            className="px-4 py-3 bg-surface2 text-text-primary border border-border rounded-xl placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-cta/40 focus:border-cta/60 transition-all duration-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">Zopakovat heslo</label>
          <input
            type="password"
            placeholder="Stejné heslo ještě jednou"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="px-4 py-3 bg-surface2 text-text-primary border border-border rounded-xl placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-cta/40 focus:border-cta/60 transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full py-3.5 bg-cta hover:bg-highlight disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 hover:shadow-glow-blue active:scale-[0.98] mt-1"
        >
          {isSubmitting ? 'Ukládám...' : 'Uložit nové heslo'}
        </button>
      </form>
    </div>
  );
}
