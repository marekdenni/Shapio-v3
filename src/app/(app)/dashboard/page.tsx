'use client';

// Personal dashboard — user's home base after onboarding.
// Shows personalized greeting, 7-day starter challenge, analysis insights,
// today's workout, nutrition, streak, and progress photos.
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TodayWorkoutCard } from '@/components/dashboard/TodayWorkoutCard';
import { NutritionSummary } from '@/components/dashboard/NutritionSummary';
import { ProgressStreak } from '@/components/dashboard/ProgressStreak';
import { StarterChallenge } from '@/components/dashboard/StarterChallenge';
import { AnalysisInsightCard } from '@/components/dashboard/AnalysisInsightCard';
import { UpsellBanner } from '@/components/dashboard/UpsellBanner';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/lib/supabase/client';
import { DASHBOARD } from '@/constants/copy';
import { PLANS } from '@/constants/plans';
import type { WorkoutDay } from '@/types';
import type { FreeWelcomeAnalysis } from '@/lib/openai';

// Planned workout day distribution by frequency (0=Mon … 6=Sun)
function getPlannedDayIndices(daysPerWeek: number): number[] {
  const map: Record<number, number[]> = {
    1: [2],
    2: [1, 4],
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 3, 4],
    6: [0, 1, 2, 3, 4, 5],
    7: [0, 1, 2, 3, 4, 5, 6],
  };
  return map[Math.max(1, Math.min(daysPerWeek, 7))] ?? map[3];
}

// Calculate streak metrics based on plan start date and workout frequency.
// Uses planned adherence model (assumes user followed the plan) until real
// workout tracking is added.
function calcStreakData(
  planCreatedAt: string,
  daysPerWeek: number
): { completedDays: number[]; totalWorkouts: number; currentStreak: number } {
  const start = new Date(planCreatedAt);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSince = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const plannedIndices = getPlannedDayIndices(daysPerWeek);
  const todayIndex = (today.getDay() + 6) % 7; // 0=Mon

  // This week: planned workout days that are in the past (before today)
  const completedDays = plannedIndices.filter((d) => d < todayIndex);
  // If today is a workout day, mark it completed too (it's today — keep it active not completed)

  // Total workouts: full weeks × daysPerWeek + workouts in the current partial week
  const fullWeeks = Math.max(0, Math.floor(daysSince / 7));
  const daysIntoCurrentWeek = daysSince % 7;
  const workoutsThisPartialWeek = plannedIndices.filter((d) => d < daysIntoCurrentWeek).length;
  const totalWorkouts = fullWeeks * daysPerWeek + workoutsThisPartialWeek;

  // Streak: consecutive planned workout weeks × daysPerWeek + current week progress
  const currentStreak = Math.min(totalWorkouts, fullWeeks * daysPerWeek + completedDays.length);

  return { completedDays, totalWorkouts, currentStreak };
}

interface ParsedAssessment {
  freeAnalysis?: FreeWelcomeAnalysis;
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const { tier } = useSubscription();

  const [todayWorkout, setTodayWorkout] = useState<WorkoutDay | undefined>();
  const [currentDay, setCurrentDay] = useState(1);
  const [totalDays, setTotalDays] = useState(PLANS[tier].duration);
  const [planCreatedAt, setPlanCreatedAt] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FreeWelcomeAnalysis | null>(null);
  const [progressPhotos, setProgressPhotos] = useState<
    Array<{ id: string; photo_url: string; uploaded_at: string }>
  >([]);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const progressPercent = Math.round((currentDay / totalDays) * 100);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) return;

      try {
        const [planResult, photosResult] = await Promise.all([
          supabase
            .from('workout_plans')
            .select('plan_data, assessment_summary, created_at, duration_days')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from('progress_photos')
            .select('id, photo_url, uploaded_at')
            .eq('user_id', profile.id)
            .order('uploaded_at', { ascending: false })
            .limit(4),
        ]);

        if (planResult.data) {
          const pd = planResult.data;
          setPlanCreatedAt(pd.created_at);

          // Use the actual duration from the stored plan; fall back to plan-tier default
          const planDays = pd.duration_days ?? PLANS[tier].duration;
          setTotalDays(planDays);

          // Current program day
          const startDate = new Date(pd.created_at);
          const today = new Date();
          const daysDiff =
            Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          const dayNum = Math.min(daysDiff, planDays);
          setCurrentDay(dayNum);

          // Today's workout from plan data
          const weeks = pd.plan_data as { days: WorkoutDay[] }[];
          const weekIndex = Math.floor((dayNum - 1) / 7);
          const dayIndex = (dayNum - 1) % 7;
          setTodayWorkout(weeks?.[weekIndex]?.days?.[dayIndex]);

          // Parse structured analysis from assessment_summary
          if (pd.assessment_summary) {
            try {
              const parsed = JSON.parse(pd.assessment_summary) as ParsedAssessment;
              if (parsed.freeAnalysis) setAnalysis(parsed.freeAnalysis);
            } catch {
              // legacy plain-string format — no structured analysis
            }
          }
        }

        if (photosResult.data) setProgressPhotos(photosResult.data);
      } catch (err) {
        console.error('[dashboard] fetch error:', err);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, tier]);

  const greeting = profile?.name
    ? DASHBOARD.greeting(profile.name.split(' ')[0])
    : 'Ahoj!';

  const daysPerWeek = profile?.workoutDaysPerWeek ?? 3;

  const streakData =
    planCreatedAt && !loadingPlan
      ? calcStreakData(planCreatedAt, daysPerWeek)
      : { completedDays: [] as number[], totalWorkouts: 0, currentStreak: 0 };

  // Goal label for header recap
  const GOAL_LABELS: Record<string, string> = {
    fat_loss: 'Shodit tuk',
    muscle_gain: 'Nabrat svaly',
    recomposition: 'Remodelace',
    general_fitness: 'Celková kondice',
    improve_discipline: 'Disciplína & návyky',
    improve_appearance: 'Zlepšit vzhled',
  };
  const goalLabel = profile?.goal ? GOAL_LABELS[profile.goal] : null;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-primary">{greeting}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            {goalLabel && (
              <span className="text-xs font-medium text-cta bg-cta/10 px-2 py-0.5 rounded-full border border-cta/20">
                {goalLabel}
              </span>
            )}
            <p className="text-text-secondary text-sm">
              {DASHBOARD.programDay(currentDay, totalDays)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-cta">{progressPercent}%</p>
          <p className="text-xs text-text-secondary">pokroku</p>
        </div>
      </div>

      {/* ── Program progress bar ─────────────────────────────────────────── */}
      <Card variant="elevated" padding="sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-cta rounded-full" />
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Program {tier.toUpperCase()} — {totalDays} dní
            </span>
          </div>
          <span className="text-xs text-text-secondary">{currentDay}/{totalDays}</span>
        </div>
        <ProgressBar value={currentDay} max={totalDays} color="red" size="md" animated />
      </Card>

      {/* ── 7-day starter challenge ──────────────────────────────────────── */}
      {planCreatedAt && (
        <StarterChallenge
          planCreatedAt={planCreatedAt}
          workoutDaysPerWeek={daysPerWeek}
        />
      )}

      {/* ── Analysis insights ────────────────────────────────────────────── */}
      <AnalysisInsightCard
        mainBottleneck={analysis?.mainBottleneck ?? null}
        nextStep={analysis?.nextStep ?? null}
        focusArea={analysis?.focusArea ?? null}
        loading={loadingPlan}
      />

      {/* ── Upsell banner (free + starter users) ────────────────────────── */}
      <UpsellBanner />

      {/* ── Today's workout ──────────────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-3">
          {DASHBOARD.todayWorkout}
        </h2>
        {loadingPlan ? (
          <Card variant="elevated" className="h-36 animate-shimmer">
            <div />
          </Card>
        ) : (
          <TodayWorkoutCard
            workout={todayWorkout}
            currentDay={currentDay}
            totalDays={totalDays}
          />
        )}
      </div>

      {/* ── Nutrition (gated) ────────────────────────────────────────────── */}
      <NutritionSummary />

      {/* ── Weekly streak ────────────────────────────────────────────────── */}
      <ProgressStreak
        completedDays={streakData.completedDays}
        totalWorkouts={streakData.totalWorkouts}
        currentStreak={streakData.currentStreak}
      />

      {/* ── Progress photos ──────────────────────────────────────────────── */}
      {progressPhotos.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-text-primary">{DASHBOARD.photosTitle}</h2>
            <Link href="/progress" className="text-sm text-cta hover:text-highlight transition-colors">
              Zobrazit vše →
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none -mx-1 px-1">
            {progressPhotos.map((photo) => (
              <div
                key={photo.id}
                className="w-20 h-20 rounded-xl overflow-hidden border border-border shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.photo_url}
                  alt="Fotka pokroku"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <Link
              href="/progress"
              className="w-20 h-20 rounded-xl border border-dashed border-border flex items-center justify-center shrink-0 hover:border-cta/50 transition-colors"
            >
              <svg className="w-5 h-5 text-text-secondary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        </div>
      ) : (
        <Card variant="default">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-surface2 border border-border flex items-center justify-center text-xl shrink-0">
              📸
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">Přidej svou první fotku</p>
              <p className="text-xs text-text-secondary">Sleduj svůj pokrok v čase</p>
            </div>
            <Link href="/progress">
              <button className="px-3 py-1.5 bg-surface2 border border-border rounded-lg text-xs text-text-secondary hover:text-text-primary hover:border-border/60 transition-colors">
                Přidat
              </button>
            </Link>
          </div>
        </Card>
      )}

      {/* ── Core navigation shortcuts ────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        {[
          { href: '/plan', icon: '📋', label: 'Plán' },
          { href: '/coach', icon: '🤖', label: 'AI Kouč' },
          { href: '/progress', icon: '📈', label: 'Pokrok' },
        ].map(({ href, icon, label }) => (
          <Link key={href} href={href}>
            <div className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-border bg-surface hover:border-cta/40 hover:bg-surface2 transition-all duration-200">
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-medium text-text-secondary">{label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
