'use client';

// Daily nutrition summary.
// When consumed data is present: shows progress vs target (future tracking mode).
// When no consumed data: shows plan targets only — no misleading 0% progress ring.
import React from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LockedFeature } from '@/components/paywall/LockedFeature';
import type { MacroTargets } from '@/types';

interface NutritionSummaryProps {
  targets?: MacroTargets;
  consumed?: Partial<MacroTargets>;
}

const defaultTargets: MacroTargets = {
  calories: 2400,
  proteinG: 180,
  carbsG: 250,
  fatG: 70,
};

export function NutritionSummary({
  targets = defaultTargets,
  consumed,
}: NutritionSummaryProps) {
  const hasConsumedData = (consumed?.calories ?? 0) > 0;

  const macros = [
    { label: 'Bílkoviny', current: consumed?.proteinG ?? 0, target: targets.proteinG, unit: 'g', color: 'red' as const },
    { label: 'Sacharidy', current: consumed?.carbsG ?? 0, target: targets.carbsG, unit: 'g', color: 'blue' as const },
    { label: 'Tuky', current: consumed?.fatG ?? 0, target: targets.fatG, unit: 'g', color: 'yellow' as const },
  ];

  return (
    <Card variant="elevated">
      <h3 className="text-base font-semibold text-text-primary mb-4">Výživa dnes</h3>

      {/* Calorie header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div>
          {hasConsumedData ? (
            <>
              <p className="text-2xl font-black text-text-primary">
                {consumed!.calories}
                <span className="text-base font-normal text-text-secondary ml-1">kcal</span>
              </p>
              <p className="text-sm text-text-secondary">z {targets.calories} kcal cíle</p>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold text-text-secondary/50 uppercase tracking-wider mb-1">
                Denní cíl
              </p>
              <p className="text-2xl font-black text-text-primary">
                {targets.calories}
                <span className="text-base font-normal text-text-secondary ml-1">kcal</span>
              </p>
            </>
          )}
        </div>

        {hasConsumedData ? (
          /* Circular progress — only shown when we have real consumption data */
          <div className="w-14 h-14 relative shrink-0">
            <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
              <circle cx="22" cy="22" r="18" fill="none" stroke="#2A2A31" strokeWidth="4" />
              <circle
                cx="22" cy="22" r="18" fill="none" stroke="#B3263E" strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - Math.min(1, (consumed!.calories ?? 0) / targets.calories))}`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-text-primary">
                {Math.round(((consumed!.calories ?? 0) / targets.calories) * 100)}%
              </span>
            </div>
          </div>
        ) : (
          /* Calorie label tile — shown when no tracking data yet */
          <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-surface2 border border-border shrink-0">
            <span className="text-lg">🥗</span>
          </div>
        )}
      </div>

      {/* Macro breakdowns — gated for free users */}
      <LockedFeature
        feature="nutrition_macros"
        title="Makra a výživa"
        description="Podrobné makronutrienty jsou dostupné od Starter plánu."
        ctaText="Odemknout makra →"
        blurContent={true}
      >
        <div className="flex flex-col gap-3">
          {macros.map((macro) => (
            <div key={macro.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-text-secondary">{macro.label}</span>
                <span className="text-sm font-medium text-text-primary">
                  {hasConsumedData ? (
                    <>{macro.current}<span className="text-text-secondary/60 font-normal">/{macro.target}{macro.unit}</span></>
                  ) : (
                    <>{macro.target}<span className="text-text-secondary/60 font-normal"> {macro.unit}</span></>
                  )}
                </span>
              </div>
              <ProgressBar
                value={hasConsumedData ? macro.current : macro.target}
                max={macro.target}
                color={macro.color}
                size="sm"
              />
            </div>
          ))}
          {!hasConsumedData && (
            <p className="text-xs text-text-secondary/50 mt-1">
              Sledování příjmu — připravujeme
            </p>
          )}
        </div>
      </LockedFeature>
    </Card>
  );
}

export default NutritionSummary;
