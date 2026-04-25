'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/onboarding';
import { useAuthStore } from '@/stores/auth';

const ANALYSIS_STEPS = [
  { label: 'Analyzujeme tvůj profil a cíle',       detail: 'Úroveň, vybavení, dostupný čas' },
  { label: 'Sestavujeme tréninkový plán',           detail: 'Frekvence, progresivní přetížení' },
  { label: 'Zpracováváme výživový přístup',         detail: 'Makra, stravovací preference' },
  { label: 'Vyhodnocujeme překážky',               detail: 'Personalizace pro tvé bariéry' },
  { label: 'Tvoříme transformační roadmap',         detail: '30–180 dní struktury dopředu' },
  { label: 'Finalizujeme analýzu',                  detail: 'Poslední přizpůsobení' },
];

export default function LoadingAnalysisPage() {
  const router = useRouter();
  const { profile, updateProfile } = useAuthStore();
  const store = useOnboardingStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  // Advance through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Animate progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 2.5;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Trigger AI plan generation
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const generatePlan = async () => {
      try {
        const profileData = store.toProfile();
        const onboardingContext = store.toOnboardingContext();

        const response = await fetch('/api/onboarding/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile: { ...profileData, ...profile },
            onboardingContext,
          }),
        });

        if (!response.ok) throw new Error('Failed to generate plan');

        setProgress(100);
        store.reset();
        setTimeout(() => router.push('/onboarding/results'), 800);
      } catch (err) {
        console.error('Error generating plan:', err);
        setError('Nastala chyba při generování plánu. Přesměrujeme tě dál.');
        setTimeout(() => router.push('/onboarding/results'), 2000);
      } finally {
        await updateProfile({ onboardingCompleted: true });
      }
    };

    generatePlan();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressPct = Math.min(100, Math.round(progress));

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 overflow-hidden">

      {/* ── Ambient background ────────────��─────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cta/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-highlight/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[200px] h-[200px] bg-cta/4 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">

        {/* ── AI Brain animation ─────────────────────────────��─────────────── */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer pulse rings */}
          <div className="absolute w-32 h-32 rounded-full border border-cta/15 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute w-24 h-24 rounded-full border border-cta/20 animate-ping" style={{ animationDuration: '2.6s', animationDelay: '0.4s' }} />
          {/* Gradient orb */}
          <div className="relative w-20 h-20 bg-gradient-cta rounded-full shadow-glow-blue-lg flex items-center justify-center">
            {/* Rotating inner ring */}
            <div className="absolute inset-1 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" style={{ animationDuration: '1.8s' }} />
            {/* Icon */}
            <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>

        {/* ── Headline ──────────────────────────────��──────────────────────── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cta/10 border border-cta/25 rounded-full mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-cta uppercase tracking-wider">AI analýza</span>
          </div>
          <h1 className="text-2xl font-black text-text-primary mb-2">
            Personalizujeme tvůj plán
          </h1>
          <p className="text-text-secondary text-sm">
            AI zpracovává tvůj profil a generuje<br />transformační plán šitý na míru
          </p>
        </div>

        {/* ── Progress bar ────────────────────────────��────────────────────── */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between text-xs text-text-secondary/60 mb-2">
            <span>Probíhá analýza</span>
            <span className="font-mono font-semibold text-cta">{progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-surface2 rounded-full border border-border/50 overflow-hidden">
            <div
              className="h-full bg-gradient-cta rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* ── Step list ──────────────────────────────────���─────────────────── */}
        <div className="w-full bg-surface border border-border rounded-2xl p-4 text-left mb-6">
          {ANALYSIS_STEPS.map((step, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            return (
              <div
                key={i}
                className={[
                  'flex items-start gap-3 py-2.5 transition-all duration-300',
                  i < ANALYSIS_STEPS.length - 1 ? 'border-b border-border/40' : '',
                  isDone ? 'opacity-60' : isActive ? 'opacity-100' : 'opacity-30',
                ].join(' ')}
              >
                {/* Status icon */}
                <div className={[
                  'w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all',
                  isDone
                    ? 'bg-cta'
                    : isActive
                    ? 'bg-cta/20 border-2 border-cta'
                    : 'bg-surface2 border border-border/50',
                ].join(' ')}>
                  {isDone ? (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-cta animate-pulse" />
                  ) : null}
                </div>

                {/* Copy */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-tight ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="text-xs text-cta/70 mt-0.5 animate-fade-in">{step.detail}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer note ───────────────────────────────────────────────────��� */}
        <p className="text-xs text-text-secondary/40 leading-relaxed">
          Průměrná doba analýzy: 15–30 sekund.<br />
          Plán je zcela unikátní pro tvůj profil.
        </p>

        {/* ── Error state ────────────────────────��─────────────────────────── */}
        {error && (
          <div className="mt-5 p-3 bg-surface border border-border rounded-xl text-sm text-text-secondary max-w-xs text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
