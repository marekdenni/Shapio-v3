'use client';

// Weekly consistency tracker showing workout days
import React from 'react';
import { Card } from '@/components/ui/Card';

interface ProgressStreakProps {
  completedDays?: number[]; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
  totalWorkouts?: number;
  currentStreak?: number;
}

const dayLabels = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

export function ProgressStreak({
  completedDays = [],
  totalWorkouts = 0,
  currentStreak = 0,
}: ProgressStreakProps) {
  // Current day of week (0 = Monday)
  const today = (new Date().getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

  return (
    <Card variant="elevated">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-primary">Konzistence</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-2xl">🔥</span>
          <span className="text-lg font-black text-cta">{currentStreak}</span>
          <span className="text-xs text-text-secondary">dní v řadě</span>
        </div>
      </div>

      {/* Weekly day indicators */}
      <div className="flex gap-2 mb-4">
        {dayLabels.map((day, i) => {
          const isCompleted = completedDays.includes(i);
          const isToday = i === today;
          const isPast = i < today;

          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={[
                  'w-full aspect-square rounded-lg flex items-center justify-center transition-all',
                  isCompleted
                    ? 'bg-cta shadow-glow-red'
                    : isToday
                    ? 'border-2 border-cta/60 bg-cta/10'
                    : isPast
                    ? 'bg-surface border border-border'
                    : 'bg-surface2 border border-border/50',
                ].join(' ')}
              >
                {isCompleted && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  isToday ? 'text-cta' : isCompleted ? 'text-text-primary' : 'text-text-secondary/50'
                }`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="flex gap-4 pt-3 border-t border-border">
        <div className="flex flex-col items-center flex-1">
          <span className="text-lg font-black text-text-primary">{totalWorkouts}</span>
          <span className="text-xs text-text-secondary">celkem</span>
        </div>
        <div className="w-px bg-border" />
        <div className="flex flex-col items-center flex-1">
          <span className="text-lg font-black text-text-primary">{completedDays.length}</span>
          <span className="text-xs text-text-secondary">tento týden</span>
        </div>
        <div className="w-px bg-border" />
        <div className="flex flex-col items-center flex-1">
          <span className="text-lg font-black text-cta">{currentStreak}</span>
          <span className="text-xs text-text-secondary">streak</span>
        </div>
      </div>
    </Card>
  );
}

export default ProgressStreak;
