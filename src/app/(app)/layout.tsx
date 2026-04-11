'use client';

// App layout — middleware already guards unauthenticated access.
// This layout loads subscription data and handles onboarding redirect.
import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useAuthStore } from '@/stores/auth';
import { useSubscriptionStore } from '@/stores/subscription';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, profile, loading, loadProfile } = useAuthStore();
  const loadSubscription = useSubscriptionStore((s) => s.loadSubscription);

  // If user is authenticated but profile failed to load, retry once
  const retryLoad = useCallback(() => {
    if (user?.id) loadProfile(user.id);
  }, [user?.id, loadProfile]);

  useEffect(() => {
    if (!loading && user && !profile) {
      retryLoad();
    }
  }, [loading, user, profile, retryLoad]);

  // Load subscription once we have a user
  useEffect(() => {
    if (user?.id) {
      loadSubscription(user.id);
    }
  }, [user?.id, loadSubscription]);

  // Redirect to onboarding if profile exists but onboarding not completed
  useEffect(() => {
    if (!loading && user && profile && !profile.onboardingCompleted) {
      router.replace('/onboarding');
    }
  }, [loading, user, profile, router]);

  // Redirect to login if auth resolved and no user (fallback — middleware is primary guard)
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  // Show loading spinner while auth is resolving or profile is still loading
  if (loading || (user && !profile)) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#8B1E2D] to-[#B3263E] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(179,38,62,0.3)] animate-pulse">
            <span className="text-white font-black text-2xl tracking-tight">S</span>
          </div>
          <div className="w-32 h-1 bg-[#1D1D22] rounded-full overflow-hidden">
            <div className="h-full bg-[#B3263E] rounded-full w-2/3 animate-[shimmer_1.5s_ease-in-out_infinite]" />
          </div>
          <p className="text-[#A1A1AA] text-sm">Načítám...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect is in flight
  if (!user) return null;

  return <AppShell>{children}</AppShell>;
}
