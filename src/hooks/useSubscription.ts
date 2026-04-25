'use client';

// Subscription hook — thin wrapper over useAccessContext.
// Delegates ALL access resolution to the unified entitlement layer, so org-plan
// grants flow through automatically. Use this for per-component tier/feature checks.
// For org-specific permission checks (member management, org features),
// use useAccessContext directly.
import { useRouter } from 'next/navigation';
import { useAccessContext } from '@/hooks/useAccessContext';
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
  const ctx = useAccessContext();

  return {
    tier: ctx.effectiveTier,
    canAccess: ctx.canAccess,
    isProOrAbove: ctx.hasProAccess,
    isElite: ctx.effectiveTier === 'elite',
    isPaid: ctx.hasPaidAccess,
    loading: ctx.loading,
    openPaywall: () => router.push('/paywall'),
  };
}
