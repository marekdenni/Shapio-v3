'use client';

// Dashboard card showing the two most actionable insights from the user's analysis.
// Gives free users a reason to return — their personalized analysis lives here.
import React from 'react';
import Link from 'next/link';

interface AnalysisInsightCardProps {
  mainBottleneck: string | null;
  nextStep: string | null;
  focusArea: string | null;
  loading?: boolean;
}

export function AnalysisInsightCard({
  mainBottleneck,
  nextStep,
  focusArea,
  loading,
}: AnalysisInsightCardProps) {
  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-4 animate-shimmer h-32" />
    );
  }

  if (!mainBottleneck && !nextStep) return null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-cta/10 border border-cta/30 rounded-lg flex items-center justify-center">
            <span className="text-xs">💡</span>
          </div>
          <h3 className="text-sm font-semibold text-text-primary">Tvoje analýza</h3>
        </div>
        <Link
          href="/onboarding/results"
          className="text-xs text-text-secondary/60 hover:text-cta transition-colors"
        >
          Zobrazit vše →
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {focusArea && (
          <div>
            <p className="text-xs font-semibold text-cta uppercase tracking-wider mb-1">
              Klíčová příležitost
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">{focusArea}</p>
          </div>
        )}

        {focusArea && (mainBottleneck || nextStep) && (
          <div className="border-t border-border" />
        )}

        {mainBottleneck && (
          <div>
            <p className="text-xs font-semibold text-text-secondary/50 uppercase tracking-wider mb-1">
              Hlavní překážka
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">{mainBottleneck}</p>
          </div>
        )}

        {nextStep && (
          <div className={mainBottleneck ? 'border-t border-border pt-3' : ''}>
            <p className="text-xs font-semibold text-text-secondary/50 uppercase tracking-wider mb-1">
              Příští krok
            </p>
            <p className="text-sm text-text-primary font-medium leading-relaxed">{nextStep}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisInsightCard;
