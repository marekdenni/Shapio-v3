'use client';

// Workout plan page - week/day view with exercise details
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { LockedFeature } from '@/components/paywall/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/lib/supabase/client';
import { PLAN } from '@/constants/copy';
import type { WorkoutWeek, WorkoutDay, Exercise } from '@/types';

export default function PlanPage() {
  const { profile } = useAuth();
  const { tier, canAccess } = useSubscription();
  const [weeks, setWeeks] = useState<WorkoutWeek[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine how many weeks are unlocked based on tier
  const unlockedWeeks = tier === 'free' ? 2 : tier === 'starter' ? 8 : weeks.length;

  useEffect(() => {
    const fetchPlan = async () => {
      if (!profile?.id) return;

      try {
        const { data } = await supabase
          .from('workout_plans')
          .select('plan_data, duration_days')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data?.plan_data) {
          setWeeks(data.plan_data as WorkoutWeek[]);
        }
      } catch (err) {
        // Show placeholder data
        setWeeks(generatePlaceholderWeeks());
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [profile?.id]);

  function generatePlaceholderWeeks(): WorkoutWeek[] {
    const days = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];
    return Array.from({ length: 4 }, (_, wi) => ({
      weekNumber: wi + 1,
      theme: `Týden ${wi + 1}`,
      days: days.map((day, di) => ({
        dayNumber: wi * 7 + di + 1,
        dayName: day,
        isRestDay: di >= 5,
        workoutType: di < 5 ? ['Horní část těla', 'Dolní část těla', 'Plný tělo', 'Záda a ramena', 'Hrudník a triceps'][di % 5] : undefined,
        durationMinutes: 45,
        exercises: di < 5 ? [
          { name: 'Bench press', sets: 3, reps: '8-12', rest: '90s', muscleGroup: 'Hrudník' },
          { name: 'Tlak s činkami', sets: 3, reps: '10-15', rest: '60s', muscleGroup: 'Ramena' },
          { name: 'Tricepsové přírazy', sets: 3, reps: '12-15', rest: '60s', muscleGroup: 'Triceps' },
        ] : [],
      })),
    }));
  }

  const currentWeek = weeks[selectedWeek];

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-text-primary">{PLAN.title}</h1>
        <p className="text-text-secondary text-sm mt-1">
          {weeks.length > 0 ? `${weeks.length * 7} dní personalizovaného plánu` : 'Načítám plán...'}
        </p>
      </div>

      {/* Week selector */}
      {!loading && weeks.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
          {weeks.map((week, i) => {
            const isLocked = i >= unlockedWeeks;
            return (
              <button
                key={i}
                onClick={() => {
                  if (!isLocked) {
                    setSelectedWeek(i);
                    setSelectedDay(null);
                  }
                }}
                className={[
                  'px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200',
                  'border min-w-[80px]',
                  selectedWeek === i && !isLocked
                    ? 'bg-[#B3263E] border-[#B3263E] text-white shadow-[0_0_15px_rgba(179,38,62,0.3)]'
                    : isLocked
                    ? 'bg-surface border-border text-text-secondary/30 cursor-not-allowed'
                    : 'bg-surface2 border-border text-text-secondary hover:text-text-primary hover:border-[#B3263E]/40',
                ].join(' ')}
              >
                {isLocked ? (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    T{week.weekNumber}
                  </span>
                ) : (
                  `T${week.weekNumber}`
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Locked weeks notice */}
      {tier === 'free' && weeks.length > 2 && (
        <LockedFeature
          feature="plan_90_days"
          title="Týdny 3+ jsou zamknuty"
          description="Odemkni celý 90denní plán s PRO předplatným."
          ctaText="Odemknout celý plán →"
          blurContent={false}
        >
          <div />
        </LockedFeature>
      )}

      {/* Day list for selected week */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-surface2 rounded-2xl animate-shimmer border border-border" />
          ))}
        </div>
      ) : currentWeek ? (
        <div>
          {/* Week theme */}
          {currentWeek.theme && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-cta rounded-full" />
              <h2 className="text-base font-semibold text-text-primary">{currentWeek.theme}</h2>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {currentWeek.days.map((day, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(selectedDay?.dayNumber === day.dayNumber ? null : day)}
                className={[
                  'w-full text-left rounded-2xl border transition-all duration-200',
                  selectedDay?.dayNumber === day.dayNumber
                    ? 'bg-surface2 border-cta/40'
                    : 'bg-surface border-border hover:border-border/60 hover:bg-surface2',
                ].join(' ')}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Day indicator */}
                  <div
                    className={[
                      'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0',
                      day.isRestDay
                        ? 'bg-surface2 border border-border text-text-secondary/40'
                        : 'bg-cta/20 border border-cta/40 text-cta',
                    ].join(' ')}
                  >
                    {day.isRestDay ? '😴' : `D${i + 1}`}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary">{day.dayName}</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {day.isRestDay
                        ? PLAN.restDay
                        : `${day.workoutType || 'Trénink'} • ${day.durationMinutes || 45} min • ${day.exercises.length} cviků`}
                    </p>
                  </div>

                  {!day.isRestDay && (
                    <svg
                      className={`w-4 h-4 text-text-secondary/50 transition-transform ${selectedDay?.dayNumber === day.dayNumber ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>

                {/* Expanded exercise list */}
                {selectedDay?.dayNumber === day.dayNumber && !day.isRestDay && (
                  <div className="px-4 pb-4 border-t border-border/50 pt-3">
                    {day.warmup && (
                      <div className="mb-3 p-2.5 bg-background rounded-xl border border-border">
                        <p className="text-xs font-semibold text-text-secondary mb-1">{PLAN.warmup}</p>
                        <p className="text-xs text-text-secondary/70">{day.warmup}</p>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      {day.exercises.map((exercise: Exercise, j: number) => (
                        <div key={j} className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
                          <div className="w-6 h-6 rounded-lg bg-cta/10 border border-cta/20 flex items-center justify-center text-xs font-bold text-cta shrink-0 mt-0.5">
                            {j + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-text-primary">{exercise.name}</p>
                            {exercise.muscleGroup && (
                              <p className="text-xs text-text-secondary/60">{exercise.muscleGroup}</p>
                            )}
                          </div>
                          <div className="flex gap-3 text-xs text-text-secondary">
                            <span className="font-mono bg-surface px-2 py-1 rounded-lg border border-border">
                              {exercise.sets}× {exercise.reps}
                            </span>
                            <span className="font-mono bg-surface px-2 py-1 rounded-lg border border-border">
                              {exercise.rest}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {day.cooldown && (
                      <div className="mt-3 p-2.5 bg-background rounded-xl border border-border">
                        <p className="text-xs font-semibold text-text-secondary mb-1">{PLAN.cooldown}</p>
                        <p className="text-xs text-text-secondary/70">{day.cooldown}</p>
                      </div>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <Card variant="elevated" className="text-center py-8">
          <p className="text-text-secondary">Plán se načítá nebo ještě nebyl vygenerován.</p>
        </Card>
      )}
    </div>
  );
}
