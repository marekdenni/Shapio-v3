'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PLANS } from '@/constants/plans';
import type { SubscriptionTier } from '@/types';

interface PlanCardProps {
  tier: SubscriptionTier;
  onSelect: (tier: SubscriptionTier) => void;
  loading?: boolean;
  currentTier?: SubscriptionTier;
}

const TIER_ACCENTS: Record<SubscriptionTier, {
  cardClass: string;
  priceClass: string;
  checkClass: string;
  badgeClass: string;
}> = {
  free: {
    cardClass: 'bg-surface border-border',
    priceClass: 'text-text-primary',
    checkClass: 'text-text-secondary/50',
    badgeClass: '',
  },
  starter: {
    cardClass: 'bg-surface border-border hover:border-cta/30',
    priceClass: 'text-text-primary',
    checkClass: 'text-green-500',
    badgeClass: '',
  },
  pro: {
    cardClass: 'bg-surface2 border-cta/60 shadow-glow-blue ring-1 ring-cta/20',
    priceClass: 'text-cta',
    checkClass: 'text-cta',
    badgeClass: '',
  },
  elite: {
    cardClass: 'bg-surface border-highlight/40 hover:border-highlight/60',
    priceClass: 'text-highlight',
    checkClass: 'text-highlight',
    badgeClass: '',
  },
};

export function PlanCard({
  tier,
  onSelect,
  loading = false,
  currentTier,
}: PlanCardProps) {
  const plan = PLANS[tier];
  const accent = TIER_ACCENTS[tier];
  const isCurrentPlan = currentTier === tier;
  const isFree = tier === 'free';
  const isElite = tier === 'elite';

  return (
    <div
      className={[
        'relative flex flex-col rounded-2xl border p-5 transition-all duration-300',
        accent.cardClass,
      ].join(' ')}
    >
      {/* Popular badge */}
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge variant="popular">Nejoblíbenější</Badge>
        </div>
      )}

      {/* Elite accent bar */}
      {isElite && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-highlight/60 to-transparent rounded-t-2xl" />
      )}

      {/* PRO gradient overlay */}
      {plan.isPopular && (
        <div className="absolute inset-0 bg-gradient-to-br from-cta/5 to-highlight/5 rounded-2xl pointer-events-none" />
      )}

      <div className="relative flex flex-col h-full">
        {/* Plan header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-text-primary">{plan.name}</h3>
            {isCurrentPlan && <Badge variant="default" size="sm">Váš plán</Badge>}
            {isElite && !isCurrentPlan && (
              <span className="text-[10px] font-bold text-highlight/70 uppercase tracking-wider">Premium</span>
            )}
          </div>

          {/* Tagline */}
          {plan.tagline && (
            <p className="text-xs text-text-secondary/70 mb-3 leading-relaxed">{plan.tagline}</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-1">
            {isFree ? (
              <span className={`text-2xl font-black ${accent.priceClass}`}>Zdarma</span>
            ) : (
              <>
                <span className={`text-2xl font-black ${accent.priceClass}`}>
                  {plan.price.toLocaleString('cs-CZ')} Kč
                </span>
                {!plan.isOneTime && (
                  <span className="text-text-secondary text-sm">/měs</span>
                )}
              </>
            )}
          </div>

          {/* Duration + track fit */}
          <p className="text-xs text-text-secondary">{plan.duration} dní transformace</p>
          {plan.trackFit && (
            <p className="text-[11px] text-text-secondary/60 mt-0.5 italic">{plan.trackFit}</p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border/60 mb-4" />

        {/* Features list */}
        <ul className="flex flex-col gap-2 mb-5 flex-1">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-xs">
              <svg
                className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${accent.checkClass}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-text-primary leading-relaxed">{feature}</span>
            </li>
          ))}
          {plan.limitations?.map((limitation, i) => (
            <li key={`lim-${i}`} className="flex items-start gap-2 text-xs">
              <svg
                className="w-3.5 h-3.5 mt-0.5 shrink-0 text-text-secondary/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-text-secondary/50">{limitation}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          variant={plan.isPopular ? 'primary' : isElite ? 'secondary' : isFree ? 'ghost' : 'secondary'}
          fullWidth
          onClick={() => onSelect(tier)}
          loading={loading}
          disabled={isCurrentPlan}
          size="md"
        >
          {isCurrentPlan
            ? 'Aktuální plán'
            : isFree
            ? 'Začít zdarma'
            : `Vybrat ${plan.name}`}
        </Button>
      </div>
    </div>
  );
}

export default PlanCard;
