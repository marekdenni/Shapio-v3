'use client';

// Main dashboard page for authenticated users
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TodayWorkoutCard } from '@/components/dashboard/TodayWorkoutCard';
import { NutritionSummary } from '@/components/dashboard/NutritionSummary';
import { ProgressStreak } from '@/components/dashboard/ProgressStreak';
import { UpsellBanner } from '@/components/dashboard/UpsellBanner';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/lib/supabase/client';
import { DASHBOARD } from '@/constants/copy';
import { PLANS } from '@/constants/plans';
import type { WorkoutDay } from '@/types';

export default function DashboardPage() {
  const { profile } = useAuth();
  const { tier } = useSubscription();
  const [todayWorkout, setTodayWorkout] = useState<WorkoutDay | undefined>();
  const [currentDay, setCurrentDay] = useState(1);
  const [progressPhotos, setProgressPhotos] = useState<Array<{ id: string; photo_url: string; uploaded_at: string }>>([]);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const plan = PLANS[tier];
  const totalDays = plan.duration;
  const progressPercent = Math.round((currentDay / totalDays) * 100);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) return;

      try {
        // Fetch workout plan
        const { data: planData } = await supabase
          .from('workout_plans')
          .select('plan_data, created_at')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (planData) {
          // Calculate current day based on plan start date
          const startDate = new Date(planData.created_at);
          const today = new Date();
          const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          const dayNum = Math.min(daysDiff, totalDays);
          setCurrentDay(dayNum);

          // Find today's workout
          const weeks = planData.plan_data as { days: WorkoutDay[] }[];
          const weekIndex = Math.floor((dayNum - 1) / 7);
          const dayIndex = (dayNum - 1) % 7;
          const todayData = weeks?.[weekIndex]?.days?.[dayIndex];
          setTodayWorkout(todayData);
        }

        // Fetch progress photos
        const { data: photos } = await supabase
          .from('progress_photos')
          .select('id, photo_url, uploaded_at')
          .eq('user_id', profile.id)
          .order('uploaded_at', { ascending: false })
          .limit(4);

        if (photos) setProgressPhotos(photos);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchData();
  }, [profile?.id, totalDays]);

  const greeting = profile?.name
    ? DASHBOARD.greeting(profile.name.split(' ')[0])
    : 'Ahoj!';

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-primary">{greeting}</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {DASHBOARD.programDay(currentDay, totalDays)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-cta">{progressPercent}%</p>
          <p className="text-xs text-text-secondary">pokroku</p>
        </div>
      </div>

      {/* Program progress bar */}
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
        <ProgressBar
          value={currentDay}
          max={totalDays}
          color="red"
          size="md"
          animated
        />
      </Card>

      {/* Upsell banner for free users — more prominent */}
      {tier === 'free' && (
        <div className="bg-gradient-to-r from-[#8B1E2D]/20 to-[#B3263E]/20 border border-[#B3263E]/40 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#F5F5F5]">Odemkni plný potenciál</p>
            <p className="text-xs text-[#A1A1AA] mt-0.5">AI kouč, adaptivní plán a pokročilá výživa</p>
          </div>
          <a
            href="/paywall"
            className="shrink-0 px-4 py-2 bg-[#B3263E] hover:bg-[#D13A52] text-white text-xs font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_15px_rgba(179,38,62,0.4)]"
          >
            Upgrade →
          </a>
        </div>
      )}

      {tier !== 'free' && <UpsellBanner />}

      {/* Today's workout */}
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-3">
          {DASHBOARD.todayWorkout}
        </h2>
        {loadingPlan ? (
          <Card variant="elevated" className="h-36 animate-shimmer">
  <div></div>
</Card>
        ) : (
          <TodayWorkoutCard
            workout={todayWorkout}
            currentDay={currentDay}
            totalDays={totalDays}
          />
        )}
      </div>

      {/* Nutrition summary */}
      <NutritionSummary />

      {/* Weekly streak */}
      <ProgressStreak
        completedDays={[0, 2, 4]} // TODO: fetch real data
        totalWorkouts={Math.max(0, currentDay - 3)}
        currentStreak={3}
      />

      {/* Progress photos strip */}
      {progressPhotos.length > 0 && (
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
      )}

      {/* No photos CTA */}
      {progressPhotos.length === 0 && (
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
    </div>
  );
}
