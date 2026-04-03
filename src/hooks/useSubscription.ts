'use client';

// Hook for accessing subscription state and feature gating
import { useRouter } from 'next/navigation';
import { useSubscriptionStore } from '@/stores/subscription';
import type { SubscriptionTier } from '@/types';

interface UseSubscriptionReturn {
  tier: SubscriptionTier;
  canAccess: (feature: string) => boolean;
  isProOrAbove: boolean;
  isElite: boolean;
  isPaid: boolean;
  loading: boolean;
  openPaywall: () => void;
}

export function useSubscription(): UseSubscriptionReturn {
  const router = useRouter();
  const store = useSubscriptionStore();

  const openPaywall = () => {
    router.push('/paywall');
  };

  return {
    tier: store.tier,
    canAccess: store.canAccess,
    isProOrAbove: store.isProOrAbove(),
    isElite: store.isElite(),
    isPaid: store.isPaid(),
    loading: store.loading,
    openPaywall,
  };
}
