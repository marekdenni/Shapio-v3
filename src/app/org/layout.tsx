'use client';

// Org route group layout — loads org context and validates auth.
// Used for all /org/* routes. Does NOT enforce onboarding completion
// because org routes are accessible regardless of B2C onboarding state
// (a gym owner shouldn't need to complete personal fitness onboarding
// to manage their organization).
import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useAuthStore } from '@/stores/auth';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useOrgStore } from '@/stores/organization';
import { useSubscriptionStore } from '@/stores/subscription';

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, profileFailed, retryProfile } = useRequireAuth();
  const { loadUserOrgs, initialized } = useOrgStore();
  const loadSubscription = useSubscriptionStore((s) => s.loadSubscription);

  // Load user's organizations and subscription when auth is ready
  useEffect(() => {
    if (!loading && user?.id) {
      if (!initialized) loadUserOrgs(user.id);
      loadSubscription(user.id);
    }
  }, [loading, user?.id, initialized, loadUserOrgs, loadSubscription]);

  // Show loading while auth resolves
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#8B1E2D] to-[#B3263E] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(179,38,62,0.3)] animate-pulse">
            <span className="text-white font-black text-2xl tracking-tight">G</span>
          </div>
          <p className="text-[#A1A1AA] text-sm">Načítám...</p>
        </div>
      </div>
    );
  }

  // Profile load failed — show error with retry
  if (profileFailed) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#151518] border border-[#2A2A31] rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-[#1D1D22] border border-[#2A2A31] rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-[#F5F5F5] mb-2">
            Nepodařilo se načíst profil
          </h2>
          <p className="text-sm text-[#A1A1AA] mb-6">
            Zkontroluj připojení k internetu a zkus to znovu.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={retryProfile}
              className="w-full py-3 bg-[#B3263E] hover:bg-[#D13A52] text-white font-bold rounded-xl transition-all duration-200"
            >
              Zkusit znovu
            </button>
            <button
              onClick={() => useAuthStore.getState().signOut()}
              className="w-full py-3 bg-[#1D1D22] border border-[#2A2A31] text-[#A1A1AA] hover:text-[#F5F5F5] rounded-xl transition-all duration-200"
            >
              Odhlásit se
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
