'use client';

// App layout — middleware already guards unauthenticated access.
// This layout loads subscription data and handles onboarding redirect.
//
// RELIABILITY GUARANTEES:
// - Profile retry has a max count (prevents infinite loops on permanent failure)
// - Profile load failure shows a recoverable error state (not infinite spinner)
// - Onboarding auto-fix handles the case where form data exists but flag is false
// - Free users always reach dashboard (no plan-based blocking in layout)
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useAuthStore } from '@/stores/auth';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useSubscriptionStore } from '@/stores/subscription';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, profile, loading, profileFailed, retryProfile } = useRequireAuth();
  const { updateProfile, loadProfile } = useAuthStore();
  const loadSubscription = useSubscriptionStore((s) => s.loadSubscription);

  // Load subscription once we have a user
  useEffect(() => {
    if (user?.id) {
      loadSubscription(user.id);
    }
  }, [user?.id, loadSubscription]);

  // Redirect to onboarding if profile exists but onboarding not completed.
  // Exception: if the profile already has form data (age/height/weight > 0,
  // which are only written to DB when the onboarding form is submitted),
  // the completion flag was likely not set due to an AI generation failure.
  // In that case, auto-fix the flag silently so the user isn't stuck in a
  // redirect loop between /dashboard and /onboarding.
  useEffect(() => {
    if (!loading && user && profile && !profile.onboardingCompleted) {
      const hasSubmittedForm = profile.age > 0 && profile.heightCm > 0 && profile.weightKg > 0;
      if (hasSubmittedForm) {
        updateProfile({ onboardingCompleted: true });
        return;
      }
      router.replace('/onboarding');
    }
  }, [loading, user, profile, router, updateProfile]);

  // Show loading spinner while auth is resolving or profile is still loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-glow-blue animate-pulse">
            <span className="text-white font-black text-2xl tracking-tight">G</span>
          </div>
          <div className="w-32 h-1 bg-surface2 rounded-full overflow-hidden">
            <div className="h-full bg-cta rounded-full w-2/3 animate-[shimmer_1.5s_ease-in-out_infinite]" />
          </div>
          <p className="text-text-secondary text-sm">Načítám...</p>
        </div>
      </div>
    );
  }

  // Profile load failed after retries — show recoverable error instead of infinite spinner
  if (profileFailed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-surface2 border border-border rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            Nepodařilo se načíst profil
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            Zkontroluj připojení k internetu a zkus to znovu.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={retryProfile}
              className="w-full py-3 bg-cta hover:bg-highlight text-white font-bold rounded-xl transition-all duration-200 hover:shadow-glow-blue active:scale-[0.98]"
            >
              Zkusit znovu
            </button>
            <button
              onClick={() => useAuthStore.getState().signOut()}
              className="w-full py-3 bg-surface2 border border-border text-text-secondary hover:text-text-primary rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              Odhlásit se
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile still loading (within retry budget) — show spinner
  if (user && !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-glow-blue animate-pulse">
            <span className="text-white font-black text-2xl tracking-tight">G</span>
          </div>
          <p className="text-text-secondary text-sm">Načítám profil...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect is in flight
  if (!user) return null;

  return <AppShell>{children}</AppShell>;
}
