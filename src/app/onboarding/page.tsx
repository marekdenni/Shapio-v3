'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { StepProgress } from '@/components/onboarding/StepProgress';
import { PhotoUpload } from '@/components/onboarding/PhotoUpload';
import { QuestionnaireForm } from '@/components/onboarding/QuestionnaireForm';
import { useOnboardingStore } from '@/stores/onboarding';
import { useAuth } from '@/hooks/useAuth';
import { ONBOARDING } from '@/constants/copy';
import type { FitnessGoal } from '@/types';

const TOTAL_STEPS = 5;

const stepLabels = ['Start', 'Fotka', 'Cíl', 'Fyzička', 'Preference'];

// ── Transformation tracks ─────────────────────────────────────────────────────

interface Track {
  id: string;
  icon: string;
  title: string;
  desc: string;
  accentBorder: string;
  accentBg: string;
  iconBg: string;
  barGradient: string;
  defaultGoal: FitnessGoal;
}

const TRACKS: Track[] = [
  {
    id: 'physique',
    icon: '💪',
    title: 'Tělesná transformace',
    desc: 'Spalování tuku, nabírání svalů nebo rekompozice. Zaměřeno na měřitelné fyzické výsledky.',
    accentBorder: 'border-cta',
    accentBg: 'bg-cta/8',
    iconBg: 'bg-cta/15',
    barGradient: 'bg-cta',
    defaultGoal: 'fat_loss',
  },
  {
    id: 'looks',
    icon: '✨',
    title: 'Vzhled & Sebeobraz',
    desc: 'Estetická transformace a lepší sebedůvěra. Vypadej lépe, cíť se lépe ve svém těle.',
    accentBorder: 'border-highlight',
    accentBg: 'bg-highlight/8',
    iconBg: 'bg-highlight/15',
    barGradient: 'bg-highlight',
    defaultGoal: 'improve_appearance',
  },
  {
    id: 'habits',
    icon: '🎯',
    title: 'Disciplína & Návyky',
    desc: 'Budování pevných návyků a konzistentnosti. Pro ty, kdo chtějí změnit svůj přístup ke zdraví.',
    accentBorder: 'border-cta/60',
    accentBg: 'bg-gradient-to-r from-cta/8 to-highlight/8',
    iconBg: 'bg-surface2 border border-border',
    barGradient: 'bg-gradient-to-b from-cta to-highlight',
    defaultGoal: 'improve_discipline',
  },
];

// ── Step context copy ─────────────────────────────────────────────────────────

const STEP_CONTEXT = [
  null, // step 0 has its own full layout
  {
    eyebrow: 'Volitelné',
    title: 'Přidej výchozí fotku',
    desc: 'Pomůže AI lépe porozumět tvé výchozí pozici. Můžeš přeskočit — fotku přidáš i později.',
  },
  {
    eyebrow: 'Krok 1 ze 3',
    title: 'Tvůj cíl a základní údaje',
    desc: 'Výběr cíle a tvá tělesná data jsou základ pro přesnou personalizaci plánu.',
  },
  {
    eyebrow: 'Krok 2 ze 3',
    title: 'Tvoje zkušenosti a možnosti',
    desc: 'Tréninkové zkušenosti a dostupné vybavení určí obtížnost a strukturu plánu.',
  },
  {
    eyebrow: 'Krok 3 ze 3',
    title: 'Stravování a překážky',
    desc: 'Poslední krok. Tvé preference a typické překážky doladí AI analýzu.',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, loading, isAuthenticated } = useAuth();
  const store = useOnboardingStore();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login');
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!loading && profile?.onboardingCompleted) router.replace('/dashboard');
  }, [loading, profile?.onboardingCompleted, router]);

  const handleNext = async () => {
    if (!store.canGoNext()) return;
    if (store.currentStep === 4) {
      await handleSubmit();
      return;
    }
    store.nextStep();
  };

  const handleSubmit = async () => {
    store.setSubmitting(true);
    try {
      const profileData = store.toProfile();
      const { error } = await updateProfile(profileData);
      if (error) console.error('[onboarding] profile save failed:', error);
      router.push('/onboarding/loading-analysis');
    } finally {
      store.setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-glow-blue animate-pulse">
            <span className="text-white font-black text-2xl tracking-tight">G</span>
          </div>
          <p className="text-text-secondary text-sm">Načítám...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const renderStep = () => {
    switch (store.currentStep) {
      case 0:
        return (
          <div className="flex flex-col">
            {/* Brand header */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cta/10 border border-cta/25 rounded-full mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-cta animate-pulse" />
                <span className="text-xs font-bold text-cta uppercase tracking-wider">
                  Personalizovaná transformace
                </span>
              </div>
              <h1 className="text-3xl font-black text-text-primary mb-2 leading-tight">
                Která cesta tě{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #7C3AED)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  čeká?
                </span>
              </h1>
              <p className="text-text-secondary text-sm max-w-xs mx-auto">
                Vyber svůj typ transformace — přizpůsobíme ti plán, analýzu i přístup.
              </p>
            </div>

            {/* Track cards */}
            <div className="flex flex-col gap-3 mb-8">
              {TRACKS.map((track) => {
                const isSelected = store.selectedTrack === track.id;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      store.setField('selectedTrack', track.id);
                      store.setField('goal', track.defaultGoal);
                    }}
                    className={[
                      'relative flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200',
                      isSelected
                        ? `${track.accentBorder} ${track.accentBg} shadow-glow-blue`
                        : 'border-border bg-surface hover:border-border/60 hover:bg-surface2',
                    ].join(' ')}
                  >
                    {/* Left accent bar */}
                    <div className={`w-1 h-12 rounded-full ${track.barGradient} shrink-0`} />

                    {/* Icon bubble */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${track.iconBg}`}>
                      {track.icon}
                    </div>

                    {/* Copy */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-text-primary mb-0.5">{track.title}</p>
                      <p className="text-xs text-text-secondary leading-relaxed">{track.desc}</p>
                    </div>

                    {/* Check */}
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-cta flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-border shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-5 border-t border-border justify-center">
              {[
                { value: '12 000+', label: 'Uživatelů' },
                { value: '< 5 min', label: 'Nastavení' },
                { value: '100%', label: 'Personalizace' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <span className="text-xl font-black text-cta">{stat.value}</span>
                  <span className="text-xs text-text-secondary">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 1: {
        const ctx = STEP_CONTEXT[1]!;
        return (
          <div>
            <StepHeader eyebrow={ctx.eyebrow} title={ctx.title} desc={ctx.desc} />
            <PhotoUpload
              photos={store.photos}
              photoConsent={store.photoConsent}
              onPhotosChange={(photos) => store.setField('photos', photos)}
              onConsentChange={(consent) => store.setField('photoConsent', consent)}
            />
          </div>
        );
      }

      case 2: {
        const ctx = STEP_CONTEXT[2]!;
        return (
          <div>
            <StepHeader eyebrow={ctx.eyebrow} title={ctx.title} desc={ctx.desc} />
            <QuestionnaireForm step={2} />
          </div>
        );
      }

      case 3: {
        const ctx = STEP_CONTEXT[3]!;
        return (
          <div>
            <StepHeader eyebrow={ctx.eyebrow} title={ctx.title} desc={ctx.desc} />
            <QuestionnaireForm step={3} />
          </div>
        );
      }

      case 4: {
        const ctx = STEP_CONTEXT[4]!;
        return (
          <div>
            <StepHeader eyebrow={ctx.eyebrow} title={ctx.title} desc={ctx.desc} />
            <QuestionnaireForm step={4} />
          </div>
        );
      }

      default:
        return null;
    }
  };

  const ctaLabel =
    store.currentStep === 0
      ? ONBOARDING.welcomeCta
      : store.currentStep === 4
      ? ONBOARDING.submitButton
      : ONBOARDING.nextButton;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-5 pb-2 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-cta rounded-lg flex items-center justify-center shadow-glow-blue">
            <span className="text-white font-black text-sm">G</span>
          </div>
          <span className="text-sm font-bold text-text-primary">Get Beter</span>
        </div>
        {store.currentStep > 0 && (
          <span className="text-xs text-text-secondary/50">
            {store.currentStep}/{TOTAL_STEPS - 1}
          </span>
        )}
      </div>

      <div className="max-w-lg mx-auto w-full px-4 py-4 flex flex-col flex-1">
        {/* Progress bar (steps 1–4) */}
        {store.currentStep > 0 && (
          <div className="mb-6">
            <StepProgress
              currentStep={store.currentStep}
              totalSteps={TOTAL_STEPS}
              stepLabels={stepLabels}
            />
          </div>
        )}

        {/* Step content */}
        <div className="flex-1 animate-fade-in">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleNext}
            loading={store.isSubmitting}
            disabled={!store.canGoNext()}
          >
            {ctaLabel}
          </Button>

          {store.currentStep > 0 && (
            <Button
              variant="ghost"
              fullWidth
              size="md"
              onClick={store.prevStep}
              disabled={store.isSubmitting}
            >
              ← {ONBOARDING.prevButton}
            </Button>
          )}

          {store.currentStep === 1 && (
            <button
              type="button"
              onClick={store.nextStep}
              className="text-sm text-text-secondary/60 hover:text-text-secondary transition-colors py-1"
            >
              {ONBOARDING.photoSkip}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StepHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold text-cta/70 uppercase tracking-widest mb-1">{eyebrow}</p>
      <h2 className="text-2xl font-black text-text-primary mb-1.5">{title}</h2>
      <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}
