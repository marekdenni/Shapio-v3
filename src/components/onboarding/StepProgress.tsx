'use client';

// Step indicator bar for onboarding flow
import React from 'react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function StepProgress({
  currentStep,
  totalSteps,
  stepLabels,
}: StepProgressProps) {
  const progressPercent = ((currentStep) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="w-full h-1 bg-border rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-cta rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;

          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                  isCompleted
                    ? 'bg-cta text-white'
                    : isCurrent
                    ? 'bg-cta/20 border-2 border-cta text-cta'
                    : 'bg-surface2 border border-border text-text-secondary/40',
                ].join(' ')}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {stepLabels?.[i] && (
                <span
                  className={`hidden sm:block text-xs font-medium transition-colors ${
                    isCurrent ? 'text-text-primary' : 'text-text-secondary/50'
                  }`}
                >
                  {stepLabels[i]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Step counter */}
      <p className="text-center text-sm text-text-secondary mt-4">
        Krok <span className="text-text-primary font-semibold">{currentStep + 1}</span> z{' '}
        <span className="text-text-primary font-semibold">{totalSteps}</span>
      </p>
    </div>
  );
}

export default StepProgress;
