'use client';

// Goal selector component with 4 cards
import React from 'react';
import type { FitnessGoal } from '@/types';
import { ONBOARDING } from '@/constants/copy';

interface GoalSelectorProps {
  value: FitnessGoal | null;
  onChange: (goal: FitnessGoal) => void;
}

const goals: { id: FitnessGoal; label: string; emoji: string; description: string }[] = [
  {
    id: 'fat_loss',
    label: ONBOARDING.goals.fat_loss.label,
    emoji: ONBOARDING.goals.fat_loss.emoji,
    description: ONBOARDING.goals.fat_loss.description,
  },
  {
    id: 'muscle_gain',
    label: ONBOARDING.goals.muscle_gain.label,
    emoji: ONBOARDING.goals.muscle_gain.emoji,
    description: ONBOARDING.goals.muscle_gain.description,
  },
  {
    id: 'recomposition',
    label: ONBOARDING.goals.recomposition.label,
    emoji: ONBOARDING.goals.recomposition.emoji,
    description: ONBOARDING.goals.recomposition.description,
  },
  {
    id: 'general_fitness',
    label: ONBOARDING.goals.general_fitness.label,
    emoji: ONBOARDING.goals.general_fitness.emoji,
    description: ONBOARDING.goals.general_fitness.description,
  },
];

export function GoalSelector({ value, onChange }: GoalSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {goals.map((goal) => {
        const isSelected = value === goal.id;
        return (
          <button
            key={goal.id}
            type="button"
            onClick={() => onChange(goal.id)}
            className={[
              'relative flex flex-col items-start p-4 rounded-2xl border-2 text-left',
              'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
              isSelected
                ? 'border-cta bg-cta/10 shadow-glow-red'
                : 'border-border bg-surface2 hover:border-border/60',
            ].join(' ')}
          >
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cta flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Emoji icon */}
            <span className="text-3xl mb-3">{goal.emoji}</span>

            {/* Label */}
            <span className={`font-bold text-base ${isSelected ? 'text-text-primary' : 'text-text-primary'}`}>
              {goal.label}
            </span>

            {/* Description */}
            <span className="text-xs text-text-secondary mt-1 leading-relaxed">
              {goal.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default GoalSelector;
