'use client';

// 7-day starter challenge — shows the user's first-week progress track.
// Completion is calculated from plan start date (planned adherence model).
// Designed to create visible forward motion from day one for all tier users.
import React from 'react';

interface StarterChallengeProps {
  planCreatedAt: string | null;
  workoutDaysPerWeek: number;
}

// Canonical planned workout day distribution by frequency (0=Mon … 6=Sun)
function getPlannedDayIndices(daysPerWeek: number): number[] {
  const map: Record<number, number[]> = {
    1: [2],                         // Wed
    2: [1, 4],                      // Tue, Fri
    3: [0, 2, 4],                   // Mon, Wed, Fri
    4: [0, 1, 3, 4],                // Mon, Tue, Thu, Fri
    5: [0, 1, 2, 3, 4],             // Mon–Fri
    6: [0, 1, 2, 3, 4, 5],          // Mon–Sat
    7: [0, 1, 2, 3, 4, 5, 6],       // Every day
  };
  return map[Math.max(1, Math.min(daysPerWeek, 7))] ?? map[3];
}

function getDaysSince(isoDate: string): number {
  const start = new Date(isoDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function getMessage(day: number, isComplete: boolean): string {
  if (isComplete) return 'Prvních 7 dní zvládnuto — skvělý start! 🔥';
  if (day <= 0) return 'Začínáme. Prvních 7 dní nastaví tvůj rytmus.';
  if (day === 1) return 'Den 1 — začátek je nejdůležitější krok.';
  if (day <= 3) return `Den ${day} z 7 — dobrý start. Pokračuj.`;
  if (day <= 5) return `Den ${day} z 7 — jsi v tempu. Nevzdávej se.`;
  return `Den ${day} z 7 — téměř hotovo!`;
}

export function StarterChallenge({ planCreatedAt, workoutDaysPerWeek }: StarterChallengeProps) {
  if (!planCreatedAt) return null;

  const daysSince = getDaysSince(planCreatedAt);
  const challengeDay = Math.max(0, Math.min(daysSince, 6)); // 0-indexed: 0 = day 1, 6 = day 7
  const isComplete = daysSince >= 7;
  const plannedDayIndices = getPlannedDayIndices(workoutDaysPerWeek);

  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏁</span>
          <h3 className="text-sm font-semibold text-text-primary">7denní starter výzva</h3>
        </div>
        {isComplete ? (
          <span className="px-2 py-0.5 bg-green-900/30 border border-green-700/40 rounded-full text-xs text-green-400 font-semibold">
            Dokončeno ✓
          </span>
        ) : (
          <span className="text-xs text-text-secondary/60">
            {challengeDay + 1}/7
          </span>
        )}
      </div>

      {/* Day track */}
      <div className="flex gap-1.5 mb-3">
        {Array.from({ length: 7 }, (_, i) => {
          const isWorkoutDay = plannedDayIndices.includes(i % 7);
          const isPast = i < challengeDay || isComplete;
          const isToday = i === challengeDay && !isComplete;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={[
                  'w-full aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200',
                  isPast && isWorkoutDay
                    ? 'bg-cta text-white shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                    : isPast
                    ? 'bg-surface2 border border-border text-text-secondary/30'
                    : isToday && isWorkoutDay
                    ? 'bg-cta/20 border-2 border-cta text-cta'
                    : isToday
                    ? 'bg-surface2 border-2 border-border text-text-secondary/50'
                    : 'bg-surface2 border border-border/40 text-text-secondary/20',
                ].join(' ')}
              >
                {isPast && isWorkoutDay ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {isWorkoutDay && (
                <div className={`w-1 h-1 rounded-full ${isPast || isToday ? 'bg-cta/60' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-text-secondary leading-relaxed">
        {getMessage(challengeDay + 1, isComplete)}
      </p>
    </div>
  );
}

export default StarterChallenge;
