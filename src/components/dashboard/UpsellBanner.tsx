'use client';

// Subtle upsell banner for free users - dismissable
import React, { useState } from 'react';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';

export function UpsellBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { tier } = useSubscription();

  // Only show for free tier
  if (tier !== 'free' || dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary/20 via-cta/15 to-primary/20 border border-cta/30 rounded-2xl p-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-cta/5 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-9 h-9 rounded-xl bg-cta/20 border border-cta/40 flex items-center justify-center shrink-0">
            <svg className="w-4.5 h-4.5 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Odemkni plný plán a AI kouče</p>
            <p className="text-xs text-text-secondary">PRO od 349 Kč/měs • 14denní garance</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/paywall"
            className="px-4 py-2 bg-cta hover:bg-highlight text-white text-sm font-semibold rounded-xl transition-colors shadow-glow-red"
          >
            Upgrade
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-text-secondary/60 hover:text-text-secondary hover:bg-surface2 transition-colors"
            aria-label="Zavřít"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpsellBanner;
