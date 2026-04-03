'use client';

// AI analysis loading screen - shown while generating plans
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/onboarding';
import { useAuth } from '@/hooks/useAuth';

const LOADING_MESSAGES = [
  'Analyzujeme vaši výchozí formu…',
  'Připravujeme tréninkový plán…',
  'Sestavujeme doporučení ke stravě…',
  'Vyhodnocujeme vaše priority…',
  'Tvoříme váš první transformační roadmap…',
  'Finalizujeme personalizaci…',
];

export default function LoadingAnalysisPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const store = useOnboardingStore();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  // Rotate messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // Stop at 95% until API responds
        return prev + Math.random() * 3;
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

        const response = await fetch('/api/onboarding/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile: { ...profileData, ...profile },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate plan');
        }

        // Complete progress
        setProgress(100);

        // Small delay then redirect to results
        setTimeout(() => {
          router.push('/onboarding/results');
        }, 800);
      } catch (err) {
        console.error('Error generating plan:', err);
        setError('Nastala chyba při generování plánu. Zkusíme to znovu.');
        // Redirect anyway after error - show basic results
        setTimeout(() => {
          router.push('/onboarding/results');
        }, 2000);
      }
    };

    generatePlan();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cta/5 rounded-full blur-3xl animate-pulse-red" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-glow-red-lg mb-8">
          <span className="text-white font-black text-2xl">S</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-text-primary mb-2">
          Analyzujeme tvůj profil
        </h1>
        <p className="text-text-secondary text-sm mb-10">
          AI generuje personalizovaný plán přesně pro tebe
        </p>

        {/* Spinner */}
        <div className="relative mb-8">
          {/* Outer ring */}
          <div className="w-20 h-20 rounded-full border-4 border-border animate-spin">
            <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-cta -translate-y-0.5 translate-x-0.5" />
          </div>
          {/* Inner icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
        </div>

        {/* Animated message */}
        <div className="h-6 mb-8">
          <p
            key={currentMessageIndex}
            className="text-text-secondary text-base animate-fade-in"
          >
            {LOADING_MESSAGES[currentMessageIndex]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs">
          <div className="w-full h-2 bg-surface2 rounded-full border border-border overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-cta rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary/60">
            {Math.min(100, Math.round(progress))}% dokončeno
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="mt-6 p-3 bg-red-950/30 border border-red-800/50 rounded-xl text-sm text-red-400 max-w-xs">
            {error}
          </div>
        )}

        {/* Processing steps */}
        <div className="mt-10 flex flex-col gap-2 w-full max-w-xs text-left">
          {LOADING_MESSAGES.slice(0, 4).map((msg, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 text-sm transition-all duration-300 ${
                i < currentMessageIndex
                  ? 'text-text-primary'
                  : i === currentMessageIndex
                  ? 'text-text-secondary'
                  : 'text-text-secondary/30'
              }`}
            >
              {i < currentMessageIndex ? (
                <div className="w-4 h-4 rounded-full bg-cta flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : i === currentMessageIndex ? (
                <div className="w-4 h-4 rounded-full border-2 border-cta animate-spin shrink-0">
                  <div className="w-1.5 h-1.5 bg-cta rounded-full" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full border border-border/50 shrink-0" />
              )}
              <span className="truncate">{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
