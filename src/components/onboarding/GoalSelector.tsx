'use client';

import React from 'react';
import type { FitnessGoal } from '@/types';
import { ONBOARDING } from '@/constants/copy';

interface GoalSelectorProps {
  value: FitnessGoal | null;
  onChange: (goal: FitnessGoal) => void;
}

interface GoalDef {
  id: FitnessGoal;
  label: string;
  emoji: string;
  description: string;
}

interface TrackGroup {
  label: string;
  accent: string;
  dot: string;
  goals: GoalDef[];
}

const ALL_GOALS: GoalDef[] = [
  { id: 'fat_loss',           label: ONBOARDING.goals.fat_loss.label,           emoji: ONBOARDING.goals.fat_loss.emoji,           description: ONBOARDING.goals.fat_loss.description },
  { id: 'muscle_gain',        label: ONBOARDING.goals.muscle_gain.label,        emoji: ONBOARDING.goals.muscle_gain.emoji,        description: ONBOARDING.goals.muscle_gain.description },
  { id: 'recomposition',      label: ONBOARDING.goals.recomposition.label,      emoji: ONBOARDING.goals.recomposition.emoji,      description: ONBOARDING.goals.recomposition.description },
  { id: 'improve_appearance', label: ONBOARDING.goals.improve_appearance.label, emoji: ONBOARDING.goals.improve_appearance.emoji, description: ONBOARDING.goals.improve_appearance.description },
  { id: 'general_fitness',    label: ONBOARDING.goals.general_fitness.label,    emoji: ONBOARDING.goals.general_fitness.emoji,    description: ONBOARDING.goals.general_fitness.description },
  { id: 'improve_discipline', label: ONBOARDING.goals.improve_discipline.label, emoji: ONBOARDING.goals.improve_discipline.emoji, description: ONBOARDING.goals.improve_discipline.description },
];

const GOAL_MAP = Object.fromEntries(ALL_GOALS.map((g) => [g.id, g])) as Record<FitnessGoal, GoalDef>;

const TRACK_GROUPS: TrackGroup[] = [
  {
    label: 'Tělesná transformace',
    accent: 'text-cta',
    dot: 'bg-cta',
    goals: [GOAL_MAP.fat_loss, GOAL_MAP.muscle_gain, GOAL_MAP.recomposition],
  },
  {
    label: 'Vzhled & kondice',
    accent: 'text-highlight',
    dot: 'bg-highlight',
    goals: [GOAL_MAP.improve_appearance, GOAL_MAP.general_fitness],
  },
  {
    label: 'Disciplína & návyky',
    accent: 'text-cta/70',
    dot: 'bg-gradient-to-r from-cta to-highlight',
    goals: [GOAL_MAP.improve_discipline],
  },
];

export function GoalSelector({ value, onChange }: GoalSelectorProps) {
  return (
    <div className="flex flex-col gap-5">
      {TRACK_GROUPS.map((group) => (
        <div key={group.label}>
          {/* Track label */}
          <div className="flex items-center gap-2 mb-2.5">
            <div className={`w-1.5 h-1.5 rounded-full ${group.dot}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${group.accent}`}>
              {group.label}
            </span>
          </div>

          {/* Goals in this track */}
          <div className="grid grid-cols-2 gap-2.5">
            {group.goals.map((goal) => {
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
                      ? 'border-cta bg-cta/10 shadow-glow-blue'
                      : 'border-border bg-surface2 hover:border-border/60',
                  ].join(' ')}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cta flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <span className="text-2xl mb-2.5">{goal.emoji}</span>
                  <span className="font-bold text-sm text-text-primary leading-tight mb-1">
                    {goal.label}
                  </span>
                  <span className="text-xs text-text-secondary leading-relaxed">
                    {goal.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GoalSelector;
