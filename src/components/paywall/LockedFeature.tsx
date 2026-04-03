'use client';

// Wrapper component that shows locked overlay for gated features
import React from 'react';
import Link from 'next/link';
import { useSubscription } from '@/hooks/useSubscription';

interface LockedFeatureProps {
  feature: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  ctaText?: string;
  blurContent?: boolean;
}

export function LockedFeature({
  feature,
  children,
  title = 'Funkce PRO',
  description = 'Tato funkce je dostupná pouze v placených plánech.',
  ctaText = 'Odemknout PRO →',
  blurContent = true,
}: LockedFeatureProps) {
  const { canAccess } = useSubscription();

  // If user has access, render children normally
  if (canAccess(feature)) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Blurred content underneath */}
      {blurContent && (
        <div className="blur-sm opacity-40 pointer-events-none select-none" aria-hidden="true">
          {children}
        </div>
      )}

      {/* Lock overlay */}
      <div
        className={[
          blurContent ? 'absolute inset-0' : '',
          'flex flex-col items-center justify-center',
          'bg-background/90 backdrop-blur-sm',
          'border border-border rounded-2xl',
          !blurContent ? 'p-8' : 'p-6',
        ].join(' ')}
      >
        {/* Lock icon */}
        <div className="w-12 h-12 rounded-full bg-cta/20 border border-cta/40 flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-cta"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        {/* Text */}
        <h3 className="text-base font-semibold text-text-primary mb-2 text-center">{title}</h3>
        <p className="text-sm text-text-secondary text-center mb-5 max-w-xs">{description}</p>

        {/* CTA */}
        <Link
          href="/paywall"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-cta hover:bg-highlight text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-glow-red hover:shadow-glow-red-lg"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}

export default LockedFeature;
