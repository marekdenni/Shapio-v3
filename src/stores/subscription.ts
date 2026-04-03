'use client';

// Zustand store for subscription state and feature access control
import { create } from 'zustand';
import type { SubscriptionTier } from '@/types';
import { FEATURE_GATES } from '@/constants/plans';
import { supabase } from '@/lib/supabase/client';

interface SubscriptionState {
  tier: SubscriptionTier;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  loading: boolean;

  // Actions
  loadSubscription: (userId: string) => Promise<void>;
  setTier: (tier: SubscriptionTier) => void;

  // Feature access helpers
  canAccess: (feature: string) => boolean;
  isProOrAbove: () => boolean;
  isElite: () => boolean;
  isPaid: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  tier: 'free',
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  loading: false,

  loadSubscription: async (userId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('subscription_tier, stripe_customer_id, stripe_subscription_id')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.error('Error loading subscription:', error);
        return;
      }

      set({
        tier: (data.subscription_tier as SubscriptionTier) || 'free',
        stripeCustomerId: data.stripe_customer_id || null,
        stripeSubscriptionId: data.stripe_subscription_id || null,
      });
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      set({ loading: false });
    }
  },

  setTier: (tier: SubscriptionTier) => {
    set({ tier });
  },

  canAccess: (feature: string) => {
    const tier = get().tier;
    const allowedTiers = FEATURE_GATES[feature];
    if (!allowedTiers) return true; // Feature not gated, open to all
    return allowedTiers.includes(tier);
  },

  isProOrAbove: () => {
    const tier = get().tier;
    return tier === 'pro' || tier === 'elite';
  },

  isElite: () => {
    return get().tier === 'elite';
  },

  isPaid: () => {
    const tier = get().tier;
    return tier !== 'free';
  },
}));
