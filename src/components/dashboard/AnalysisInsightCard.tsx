'use client';

// AI analysis insight card — premium edition.
// Shows the user's most actionable AI-derived insights as a featured surface.
// Feels like a personalised intelligence summary, not a generic widget.
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
      <div className="rounded-2xl border border-cta/20 overflow-hidden animate-shimmer h-32" />
    );
  }

  if (!mainBottleneck && !nextStep && !focusArea) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cta/25 bg-surface">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cta/5 via-transparent to-highlight/5 pointer-events-none" />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/50 to-transparent" />

      <div className="relative p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-cta rounded-lg flex items-center justify-center shadow-glow-blue">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-cta uppercase tracking-wider">AI Analýza</p>
            </div>
          </div>
          <Link
            href="/onboarding/results"
            className="text-xs text-text-secondary/50 hover:text-cta transition-colors flex items-center gap-1"
          >
            Celý report
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="space-y-3">
          {/* Focus area — most prominent */}
          {focusArea && (
            <div>
              <p className="text-[10px] font-bold text-cta/80 uppercase tracking-widest mb-1">
                Klíčová příležitost
              </p>
              <p className="text-sm font-semibold text-text-primary leading-snug">{focusArea}</p>
            </div>
          )}

          {/* Divider when both sections present */}
          {focusArea && (nextStep || mainBottleneck) && (
            <div className="border-t border-border/60" />
          )}

          {/* Next step — actionable */}
          {nextStep && (
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-cta/15 border border-cta/25 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest mb-0.5">
                  Příští krok
                </p>
                <p className="text-sm text-text-primary font-medium leading-snug">{nextStep}</p>
              </div>
            </div>
          )}

          {/* Main bottleneck — informational */}
          {mainBottleneck && !nextStep && (
            <div>
              <p className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest mb-1">
                Hlavní překážka
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">{mainBottleneck}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalysisInsightCard;
