'use client';

// Full pricing section with all plan cards
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlanCard } from './PlanCard';
import type { SubscriptionTier } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

interface PricingSectionProps {
  showTitle?: boolean;
  highlightedTier?: SubscriptionTier;
}

export function PricingSection({
  showTitle = true,
  highlightedTier,
}: PricingSectionProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { tier: currentTier } = useSubscription();
  const [loadingTier, setLoadingTier] = useState<SubscriptionTier | null>(null);

  const handleSelectPlan = async (tier: SubscriptionTier) => {
    if (!isAuthenticated) {
      router.push(`/register?plan=${tier}`);
      return;
    }

    if (tier === 'free') {
      router.push('/dashboard');
      return;
    }

    setLoadingTier(tier);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoadingTier(null);
    }
  };

  const tiers: SubscriptionTier[] = ['free', 'starter', 'pro', 'elite'];

  return (
    <section className="w-full">
      {showTitle && (
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-3">
            Vyberte svůj plán
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Začni zdarma nebo odemkni plný potenciál s prémiových plánem.
          </p>
        </div>
      )}

      {/* Plan cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiers.map((tier) => (
          <PlanCard
            key={tier}
            tier={tier}
            onSelect={handleSelectPlan}
            loading={loadingTier === tier}
            currentTier={currentTier}
          />
        ))}
      </div>

      {/* Trust indicators */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          14denní garance vrácení peněz
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Zabezpečená platba přes Stripe
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <svg className="w-4 h-4 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Bez skrytých poplatků
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
