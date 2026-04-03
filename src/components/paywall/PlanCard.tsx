'use client';

// Individual pricing plan card component
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PLANS } from '@/constants/plans';
import type { SubscriptionTier } from '@/types';

interface PlanCardProps {
  tier: SubscriptionTier;
  isPopular?: boolean;
  onSelect: (tier: SubscriptionTier) => void;
  loading?: boolean;
  currentTier?: SubscriptionTier;
}

export function PlanCard({
  tier,
  onSelect,
  loading = false,
  currentTier,
}: PlanCardProps) {
  const plan = PLANS[tier];
  const isCurrentPlan = currentTier === tier;
  const isFree = tier === 'free';

  return (
    <div
      className={[
        'relative flex flex-col rounded-2xl border p-6 transition-all duration-300',
        plan.isPopular
          ? 'bg-surface2 border-cta/60 shadow-glow-red ring-1 ring-cta/20'
          : 'bg-surface border-border hover:border-border/60',
      ].join(' ')}
    >
      {/* Popular badge */}
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="popular">Nejoblíbenější</Badge>
        </div>
      )}

      {/* One-time badge */}
      {plan.isOneTime && (
        <div className="absolute -top-3 right-4">
          <Badge variant="one-time">Jednorázově</Badge>
        </div>
      )}

      {/* Plan header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
          {isCurrentPlan && (
            <Badge variant="default" size="sm">Váš plán</Badge>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          {isFree ? (
            <span className="text-3xl font-black text-text-primary">Zdarma</span>
          ) : (
            <>
              <span className="text-3xl font-black text-text-primary">
                {plan.price.toLocaleString('cs-CZ')} Kč
              </span>
              {!plan.isOneTime && (
                <span className="text-text-secondary text-sm">/měs</span>
              )}
            </>
          )}
        </div>

        {/* Duration */}
        <p className="text-sm text-text-secondary mt-1">
          {plan.duration} dní transformace
        </p>
      </div>

      {/* Features list */}
      <ul className="flex flex-col gap-2.5 mb-6 flex-1">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <svg
              className={`w-4 h-4 mt-0.5 shrink-0 ${plan.isPopular ? 'text-cta' : 'text-green-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-text-primary">{feature}</span>
          </li>
        ))}

        {/* Limitations (free plan) */}
        {plan.limitations?.map((limitation, i) => (
          <li key={`lim-${i}`} className="flex items-start gap-2.5 text-sm">
            <svg
              className="w-4 h-4 mt-0.5 shrink-0 text-text-secondary/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="text-text-secondary/60">{limitation}</span>
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <Button
        variant={plan.isPopular ? 'primary' : isFree ? 'ghost' : 'secondary'}
        fullWidth
        onClick={() => onSelect(tier)}
        loading={loading}
        disabled={isCurrentPlan}
        size="lg"
      >
        {isCurrentPlan
          ? 'Aktuální plán'
          : isFree
          ? 'Začít zdarma'
          : `Začít ${plan.name}`}
      </Button>
    </div>
  );
}

export default PlanCard;
