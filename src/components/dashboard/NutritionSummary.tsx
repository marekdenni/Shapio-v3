'use client';

// Daily nutrition summary with macro progress bars
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

const defaultConsumed: MacroTargets = {
  calories: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
};

export function NutritionSummary({
  targets = defaultTargets,
  consumed = defaultConsumed,
}: NutritionSummaryProps) {
  const macros = [
    {
      label: 'Bílkoviny',
      current: consumed.proteinG || 0,
      target: targets.proteinG,
      unit: 'g',
      color: 'red' as const,
    },
    {
      label: 'Sacharidy',
      current: consumed.carbsG || 0,
      target: targets.carbsG,
      unit: 'g',
      color: 'blue' as const,
    },
    {
      label: 'Tuky',
      current: consumed.fatG || 0,
      target: targets.fatG,
      unit: 'g',
      color: 'yellow' as const,
    },
  ];

  return (
    <Card variant="elevated">
      <h3 className="text-base font-semibold text-text-primary mb-4">Výživa dnes</h3>

      {/* Calorie summary */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div>
          <p className="text-2xl font-black text-text-primary">
            {consumed.calories || 0}
            <span className="text-base font-normal text-text-secondary ml-1">kcal</span>
          </p>
          <p className="text-sm text-text-secondary">z {targets.calories} kcal cíle</p>
        </div>
        <div className="w-14 h-14 relative">
          {/* Simple circular progress */}
          <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#2A2A31" strokeWidth="4" />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="#B3263E"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - Math.min(1, (consumed.calories || 0) / targets.calories))}`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-text-primary">
              {Math.round(((consumed.calories || 0) / targets.calories) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Macro breakdowns - gated for free users */}
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
                  {macro.current}
                  <span className="text-text-secondary/60 font-normal">/{macro.target}{macro.unit}</span>
                </span>
              </div>
              <ProgressBar
                value={macro.current}
                max={macro.target}
                color={macro.color}
                size="sm"
              />
            </div>
          ))}
        </div>
      </LockedFeature>
    </Card>
  );
}

export default NutritionSummary;
