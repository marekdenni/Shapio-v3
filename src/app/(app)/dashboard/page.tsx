'use client';

// Main authenticated dashboard — the user's transformation home base.
// Structure:
//  1. Hero welcome (greeting, track, progress bar)
//  2. Today's workout (featured card)
//  3. AI insight (personalised intelligence)
//  4. Challenge + streak band
//  5. Platform ecosystem grid
//  6. Nutrition summary
//  7. Progress photos
//  8. Contextual upsell
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TodayWorkoutCard } from '@/components/dashboard/TodayWorkoutCard';
import { NutritionSummary } from '@/components/dashboard/NutritionSummary';
import { ProgressStreak } from '@/components/dashboard/ProgressStreak';
import { StarterChallenge } from '@/components/dashboard/StarterChallenge';
import { AnalysisInsightCard } from '@/components/dashboard/AnalysisInsightCard';
import { UpsellBanner } from '@/components/dashboard/UpsellBanner';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/lib/supabase/client';
import { PLANS } from '@/constants/plans';
import type { WorkoutDay } from '@/types';
import type { FreeWelcomeAnalysis } from '@/lib/openai';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getPlannedDayIndices(daysPerWeek: number): number[] {
  const map: Record<number, number[]> = {
    1: [2], 2: [1, 4], 3: [0, 2, 4], 4: [0, 1, 3, 4],
    5: [0, 1, 2, 3, 4], 6: [0, 1, 2, 3, 4, 5], 7: [0, 1, 2, 3, 4, 5, 6],
  };
  return map[Math.max(1, Math.min(daysPerWeek, 7))] ?? map[3];
}

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
  const todayIndex = (today.getDay() + 6) % 7;
  const completedDays = plannedIndices.filter((d) => d < todayIndex);
  const fullWeeks = Math.max(0, Math.floor(daysSince / 7));
  const daysIntoCurrentWeek = daysSince % 7;
  const workoutsThisPartialWeek = plannedIndices.filter((d) => d < daysIntoCurrentWeek).length;
  const totalWorkouts = fullWeeks * daysPerWeek + workoutsThisPartialWeek;
  const currentStreak = Math.min(totalWorkouts, fullWeeks * daysPerWeek + completedDays.length);
  return { completedDays, totalWorkouts, currentStreak };
}

interface ParsedAssessment { freeAnalysis?: FreeWelcomeAnalysis; }

// Goal → track label + icon
const TRACK_MAP: Record<string, { label: string; icon: string; description: string }> = {
  fat_loss:            { label: 'Spalování tuku',    icon: '🔥', description: 'Redukce tuku & zpevnění' },
  muscle_gain:         { label: 'Nabírání svalů',    icon: '💪', description: 'Silový rozvoj & objem' },
  recomposition:       { label: 'Rekompozice těla',  icon: '⚡', description: 'Svaly + deficit v jednom' },
  general_fitness:     { label: 'Celková kondice',   icon: '🏃', description: 'Zdraví & výkonnost' },
  improve_discipline:  { label: 'Disciplína',        icon: '🎯', description: 'Návyky & konzistentnost' },
  improve_appearance:  { label: 'Zlepšit vzhled',    icon: '✨', description: 'Estetická transformace' },
};

// Fitness level label
const LEVEL_MAP: Record<string, string> = {
  beginner:     'Začátečník',
  intermediate: 'Středně pokročilý',
  advanced:     'Pokročilý',
  athlete:      'Atlet',
};

// Platform module shortcuts grid
const LIVE_MODULES = [
  { href: '/coach',      icon: '🤖', label: 'AI Kouč',   badge: 'AI' },
  { href: '/nutrition',  icon: '🥗', label: 'Výživa',    badge: null },
  { href: '/challenges', icon: '🔥', label: 'Výzvy',     badge: null },
  { href: '/progress',   icon: '📈', label: 'Pokrok',    badge: null },
];

const STAGED_MODULES = [
  { href: '/deals',     icon: '🛍️', label: 'Nabídky' },
  { href: '/gyms',      icon: '📍', label: 'Posilovny' },
  { href: '/coaches',   icon: '👨‍💼', label: 'Koučové' },
  { href: '/videos',    icon: '🎥', label: 'Videa' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { profile } = useAuth();
  const { tier } = useSubscription();

  const [todayWorkout, setTodayWorkout]   = useState<WorkoutDay | undefined>();
  const [currentDay,   setCurrentDay]    = useState(1);
  const [totalDays,    setTotalDays]     = useState(PLANS[tier].duration);
  const [planCreatedAt, setPlanCreatedAt] = useState<string | null>(null);
  const [analysis,     setAnalysis]      = useState<FreeWelcomeAnalysis | null>(null);
  const [progressPhotos, setProgressPhotos] = useState<
    Array<{ id: string; photo_url: string; uploaded_at: string }>
  >([]);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const progressPercent = Math.round((currentDay / totalDays) * 100);
  const daysPerWeek     = profile?.workoutDaysPerWeek ?? 3;

  const track = profile?.goal ? TRACK_MAP[profile.goal] : null;
  const levelLabel = profile?.fitnessLevel ? LEVEL_MAP[profile.fitnessLevel] : null;

  const greeting = profile?.name
    ? `Ahoj, ${profile.name.split(' ')[0]}!`
    : 'Ahoj!';

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
          const planDays = pd.duration_days ?? PLANS[tier].duration;
          setTotalDays(planDays);
          const startDate  = new Date(pd.created_at);
          const today      = new Date();
          const daysDiff   = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          const dayNum     = Math.min(daysDiff, planDays);
          setCurrentDay(dayNum);
          const weeks    = pd.plan_data as { days: WorkoutDay[] }[];
          const wkIdx    = Math.floor((dayNum - 1) / 7);
          const dayIdx   = (dayNum - 1) % 7;
          setTodayWorkout(weeks?.[wkIdx]?.days?.[dayIdx]);
          if (pd.assessment_summary) {
            try {
              const parsed = JSON.parse(pd.assessment_summary) as ParsedAssessment;
              if (parsed.freeAnalysis) setAnalysis(parsed.freeAnalysis);
            } catch { /* legacy plain-string format */ }
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

  const streakData = planCreatedAt && !loadingPlan
    ? calcStreakData(planCreatedAt, daysPerWeek)
    : { completedDays: [] as number[], totalWorkouts: 0, currentStreak: 0 };

  return (
    <div className="flex flex-col gap-5">

      {/* ── 1. HERO WELCOME ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-surface border border-border rounded-2xl p-5 sm:p-6">
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-br from-cta/12 to-highlight/8 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-highlight/6 rounded-full blur-2xl pointer-events-none" />
        {/* Top accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/40 to-transparent" />

        <div className="relative">
          {/* Top row */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              {/* Track badge */}
              {track && (
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1.5 h-4 bg-gradient-to-b from-cta to-highlight rounded-full shrink-0" />
                  <span className="text-xs font-bold text-cta uppercase tracking-wider">
                    {track.icon} {track.label}
                  </span>
                </div>
              )}
              {/* Greeting */}
              <h1 className="text-2xl sm:text-3xl font-black text-text-primary leading-tight">
                {greeting}
              </h1>
              {/* Meta line */}
              <p className="text-sm text-text-secondary mt-1 flex items-center gap-2 flex-wrap">
                <span>Den {currentDay} ze {totalDays}</span>
                {levelLabel && (
                  <>
                    <span className="text-border">·</span>
                    <span>{levelLabel}</span>
                  </>
                )}
                {daysPerWeek && (
                  <>
                    <span className="text-border">·</span>
                    <span>{daysPerWeek}× týdně</span>
                  </>
                )}
              </p>
            </div>

            {/* Progress percentage */}
            <div className="text-right shrink-0">
              <p
                className="text-3xl font-black leading-none"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6, #7C3AED)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {progressPercent}%
              </p>
              <p className="text-xs text-text-secondary mt-0.5">dokončeno</p>
            </div>
          </div>

          {/* Progress bar + labels */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-semibold text-text-secondary/50 uppercase tracking-wider mb-1.5">
              <span>Program {tier.toUpperCase()} · {totalDays} dní</span>
              <span>{currentDay}/{totalDays}</span>
            </div>
            <div className="h-2 bg-surface2 rounded-full overflow-hidden border border-border/40">
              <div
                className="h-full bg-gradient-cta rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. TODAY'S WORKOUT ──────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
            Dnešní trénink
          </h2>
          <Link href="/plan" className="text-xs text-cta hover:text-highlight transition-colors font-semibold">
            Celý plán →
          </Link>
        </div>
        {loadingPlan ? (
          <div className="bg-surface border border-border rounded-2xl h-32 animate-shimmer" />
        ) : (
          <TodayWorkoutCard
            workout={todayWorkout}
            currentDay={currentDay}
            totalDays={totalDays}
          />
        )}
      </div>

      {/* ── 3. AI INSIGHT ───────────────────────────────────────────────────── */}
      <AnalysisInsightCard
        mainBottleneck={analysis?.mainBottleneck ?? null}
        nextStep={analysis?.nextStep ?? null}
        focusArea={analysis?.focusArea ?? null}
        loading={loadingPlan}
      />

      {/* ── 4. CHALLENGE + STREAK ───────────────────────────────────────────── */}
      {(planCreatedAt || !loadingPlan) && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
              Výzvy & konzistence
            </h2>
            <Link href="/challenges" className="text-xs text-cta hover:text-highlight transition-colors font-semibold">
              Všechny výzvy →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Starter challenge */}
            <div>
              {loadingPlan ? (
                <div className="bg-surface border border-border rounded-2xl h-28 animate-shimmer" />
              ) : (
                <StarterChallenge
                  planCreatedAt={planCreatedAt}
                  workoutDaysPerWeek={daysPerWeek}
                />
              )}
            </div>

            {/* Streak compact */}
            <div className="bg-surface border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  Tento týden
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-base">🔥</span>
                  <span className="text-base font-black text-cta">{streakData.currentStreak}</span>
                  <span className="text-xs text-text-secondary">streak</span>
                </div>
              </div>
              <div className="flex gap-1.5">
                {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map((day, i) => {
                  const isCompleted = streakData.completedDays.includes(i);
                  const isToday = i === (new Date().getDay() + 6) % 7;
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={[
                          'w-full aspect-square rounded-lg flex items-center justify-center',
                          isCompleted
                            ? 'bg-cta shadow-glow-blue'
                            : isToday
                            ? 'border-2 border-cta/50 bg-cta/10'
                            : 'bg-surface2 border border-border/50',
                        ].join(' ')}
                      >
                        {isCompleted && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-[10px] font-medium ${isToday ? 'text-cta' : 'text-text-secondary/40'}`}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 pt-3 mt-1 border-t border-border">
                <div className="text-center flex-1">
                  <p className="text-sm font-black text-text-primary">{streakData.totalWorkouts}</p>
                  <p className="text-[10px] text-text-secondary">celkem</p>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center flex-1">
                  <p className="text-sm font-black text-text-primary">{streakData.completedDays.length}</p>
                  <p className="text-[10px] text-text-secondary">tento týden</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. PLATFORM ECOSYSTEM GRID ──────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2.5">
          Tvůj ekosystém
        </h2>

        {/* Live modules — full opacity, hover effects */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          {LIVE_MODULES.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="relative flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-surface border border-border hover:border-cta/40 hover:bg-surface2 transition-all duration-150 group">
                {item.badge && (
                  <span className="absolute top-1.5 right-1.5 px-1 py-0.5 bg-cta/20 border border-cta/30 rounded text-[8px] font-bold text-cta uppercase">
                    {item.badge}
                  </span>
                )}
                <span className="text-xl">{item.icon}</span>
                <span className="text-[11px] font-semibold text-text-secondary group-hover:text-text-primary transition-colors text-center leading-tight">
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Staged modules — muted, still navigable */}
        <div className="grid grid-cols-4 gap-2">
          {STAGED_MODULES.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="relative flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-surface border border-border/40 hover:border-border transition-all duration-150 opacity-50 hover:opacity-70">
                <span className="text-xl grayscale">{item.icon}</span>
                <span className="text-[11px] font-semibold text-text-secondary/60 text-center leading-tight">
                  {item.label}
                </span>
                <span className="text-[8px] text-text-secondary/40 font-semibold uppercase tracking-wide">brzy</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 6. UPSELL (contextual, free/starter only) ───────────────────────── */}
      <UpsellBanner />

      {/* ── 7. NUTRITION ────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Výživa</h2>
          <Link href="/nutrition" className="text-xs text-cta hover:text-highlight transition-colors font-semibold">
            Detail →
          </Link>
        </div>
        <NutritionSummary />
      </div>

      {/* ── 8. PROGRESS PHOTOS ──────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Pokrok</h2>
          <Link href="/progress" className="text-xs text-cta hover:text-highlight transition-colors font-semibold">
            Všechny fotky →
          </Link>
        </div>

        {progressPhotos.length > 0 ? (
          <div className="flex gap-2.5 overflow-x-auto scrollbar-none -mx-1 px-1">
            {progressPhotos.map((photo) => (
              <Link key={photo.id} href="/progress">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-border shrink-0 hover:border-cta/30 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.photo_url}
                    alt="Fotka pokroku"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            ))}
            <Link href="/progress">
              <div className="w-20 h-20 rounded-xl border border-dashed border-border hover:border-cta/40 flex flex-col items-center justify-center gap-1 shrink-0 transition-colors">
                <svg className="w-5 h-5 text-text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[9px] text-text-secondary/40 font-medium">Přidat</span>
              </div>
            </Link>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-surface2 border border-border flex items-center justify-center text-xl shrink-0">
              📸
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">Přidej svou první fotku</p>
              <p className="text-xs text-text-secondary">Sleduj svůj pokrok v čase</p>
            </div>
            <Link href="/progress">
              <button className="px-3 py-1.5 bg-surface2 border border-border rounded-lg text-xs text-text-secondary hover:text-text-primary hover:border-border/80 transition-colors">
                Přidat
              </button>
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
