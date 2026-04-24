'use client';

// Onboarding orchestrator page - manages multi-step onboarding flow
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { StepProgress } from '@/components/onboarding/StepProgress';
import { PhotoUpload } from '@/components/onboarding/PhotoUpload';
import { QuestionnaireForm } from '@/components/onboarding/QuestionnaireForm';
import { useOnboardingStore } from '@/stores/onboarding';
import { useAuth } from '@/hooks/useAuth';
import { ONBOARDING } from '@/constants/copy';

const TOTAL_STEPS = 5; // 0-4 (step 5 is loading, separate page)

const stepLabels = ['Vítej', 'Fotka', 'Cíl', 'Fyzička', 'Preference'];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, loading, isAuthenticated } = useAuth();
  const store = useOnboardingStore();

  // Redirect to login if not authenticated (fallback — middleware is primary guard)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

  // If onboarding already completed, go straight to dashboard
  useEffect(() => {
    if (!loading && profile?.onboardingCompleted) {
      router.replace('/dashboard');
    }
  }, [loading, profile?.onboardingCompleted, router]);

  const handleNext = async () => {
    if (!store.canGoNext()) return;

    if (store.currentStep === 4) {
      // Last step - save profile and navigate to loading analysis
      await handleSubmit();
      return;
    }

    store.nextStep();
  };

  const handleSubmit = async () => {
    store.setSubmitting(true);

    try {
      // Save profile data to Supabase before AI generation
      const profileData = store.toProfile();
      const { error } = await updateProfile(profileData);

      if (error) {
        console.error('[onboarding] profile save failed:', error);
        // Non-fatal — proceed anyway so the user isn't stuck
      }

      // Navigate to loading/analysis page
      router.push('/onboarding/loading-analysis');
    } finally {
      store.setSubmitting(false);
    }
  };

  // Wait for auth to resolve before rendering the form
  // (onboarding is outside the (app) route group, so there's no layout guard)
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-glow-red animate-pulse">
            <span className="text-white font-black text-2xl tracking-tight">G</span>
          </div>
          <p className="text-text-secondary text-sm">Načítám...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect in flight
  if (!isAuthenticated) return null;

  const renderStep = () => {
    switch (store.currentStep) {
      case 0:
        // Welcome screen
        return (
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-20 h-20 bg-gradient-cta rounded-3xl flex items-center justify-center shadow-glow-red-lg mb-6">
              <span className="text-white font-black text-4xl">G</span>
            </div>
            <h1 className="text-3xl font-black text-text-primary mb-4">
              {ONBOARDING.welcomeTitle}
            </h1>
            <p className="text-text-secondary mb-3 text-lg max-w-sm">
              {ONBOARDING.welcomeSubtitle}
            </p>
            <p className="text-text-secondary/70 text-sm max-w-sm leading-relaxed">
              {ONBOARDING.welcomeDescription}
            </p>

            {/* Stats row */}
            <div className="flex gap-6 mt-8 pt-6 border-t border-border w-full justify-center">
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

      case 1:
        // Photo upload
        return (
          <div>
            <h2 className="text-2xl font-black text-text-primary mb-2">
              {ONBOARDING.photoTitle}
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              {ONBOARDING.photoSubtitle}
            </p>
            <PhotoUpload
              photos={store.photos}
              photoConsent={store.photoConsent}
              onPhotosChange={(photos) => store.setField('photos', photos)}
              onConsentChange={(consent) => store.setField('photoConsent', consent)}
            />
          </div>
        );

      case 2:
        // Goal + basic info
        return (
          <div>
            <h2 className="text-2xl font-black text-text-primary mb-2">
              Tvůj cíl a základní info
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              Vyber si cíl a zadej základní údaje pro personalizaci plánu.
            </p>
            <QuestionnaireForm step={2} />
          </div>
        );

      case 3:
        // Fitness details
        return (
          <div>
            <h2 className="text-2xl font-black text-text-primary mb-2">
              Tvoje fyzička
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              Řekni nám o svých zkušenostech a dostupném vybavení.
            </p>
            <QuestionnaireForm step={3} />
          </div>
        );

      case 4:
        // Preferences
        return (
          <div>
            <h2 className="text-2xl font-black text-text-primary mb-2">
              Tvoje preference
            </h2>
            <p className="text-text-secondary text-sm mb-6">
              Poslední krok – řekni nám o svých preferencích a omezeních.
            </p>
            <QuestionnaireForm step={4} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-lg mx-auto w-full px-4 py-8 flex flex-col flex-1">
        {/* Step progress indicator */}
        {store.currentStep > 0 && (
          <div className="mb-8">
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

        {/* Navigation buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleNext}
            loading={store.isSubmitting}
            disabled={!store.canGoNext()}
          >
            {store.currentStep === 0
              ? ONBOARDING.welcomeCta
              : store.currentStep === 4
              ? ONBOARDING.submitButton
              : ONBOARDING.nextButton}
          </Button>

          {/* Back button (not on first step) */}
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

          {/* Skip photo (step 1 only) */}
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
