'use client';

// Free result preview page shown after onboarding AI analysis
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { RESULTS } from '@/constants/copy';
import { supabase } from '@/lib/supabase/client';

interface WorkoutPlanData {
  assessmentSummary?: string;
  focusAreas?: string[];
  weeks?: Array<{
    days: Array<{
      isRestDay: boolean;
      workoutType?: string;
      exercises: Array<{ name: string; sets: number; reps: string }>;
    }>;
  }>;
}

export default function ResultsPage() {
  const { profile } = useAuth();
  const [planData, setPlanData] = useState<WorkoutPlanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!profile?.id) return;

      try {
        const { data } = await supabase
          .from('workout_plans')
          .select('plan_data, assessment_summary')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data) {
          setPlanData({
            assessmentSummary: data.assessment_summary,
            weeks: data.plan_data as WorkoutPlanData['weeks'],
          });
        }
      } catch (err) {
        // If no plan yet, show placeholder
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [profile?.id]);

  const assessmentText =
    planData?.assessmentSummary ||
    `Na základě tvého profilu jsem sestavil personalizovaný plán zaměřený na tvůj cíl.
    Tvůj program je navržen s ohledem na tvou aktuální kondici a dostupné vybavení.
    Připravil jsem pro tebe optimální kombinaci tréninků a výživy pro maximální výsledky.`;

  // Sample exercises from plan or defaults
  const firstDay = planData?.weeks?.[0]?.days?.find((d) => !d.isRestDay);
  const sampleExercises = firstDay?.exercises?.slice(0, 3) || [
    { name: 'Bench press', sets: 3, reps: '8-12' },
    { name: 'Dřep s činkou', sets: 4, reps: '6-10' },
    { name: 'Mrtvý tah', sets: 3, reps: '5-8' },
  ];

  const focusAreas = [
    { label: 'Spalování tuku', score: 87, color: 'bg-cta' },
    { label: 'Svalový rozvoj', score: 74, color: 'bg-blue-500' },
    { label: 'Celková kondice', score: 61, color: 'bg-green-500' },
  ];

  const lockedSections = [
    {
      title: 'Podrobná analýza',
      description: 'Kompletní body composition analýza',
      icon: '📊',
    },
    {
      title: 'Adaptivní plán',
      description: 'Plán se upravuje podle tvého pokroku',
      icon: '⚡',
    },
    {
      title: 'Makra a výživa',
      description: 'Přesné kalorické a makro cíle',
      icon: '🥗',
    },
    {
      title: 'AI Kouč',
      description: 'Osobní AI asistent 24/7',
      icon: '🤖',
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-glow-red mx-auto mb-5">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-text-primary mb-2">{RESULTS.title}</h1>
          <p className="text-text-secondary">{RESULTS.subtitle}</p>
        </div>

        {/* Assessment summary */}
        <Card variant="elevated" className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-cta/20 border border-cta/40 flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">AI Analýza</span>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {loading ? (
              <span className="animate-pulse">Načítám analýzu...</span>
            ) : (
              assessmentText
            )}
          </p>
        </Card>

        {/* Focus areas */}
        <Card variant="elevated" className="mb-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">{RESULTS.focusAreas}</h3>
          <div className="flex flex-col gap-3">
            {focusAreas.map((area) => (
              <div key={area.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-text-secondary">{area.label}</span>
                  <span className="text-sm font-bold text-text-primary">{area.score}%</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden border border-border/50">
                  <div
                    className={`h-full ${area.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${area.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sample workout preview */}
        <Card variant="elevated" className="mb-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">{RESULTS.sampleWorkout}</h3>
          <div className="flex flex-col gap-2">
            {sampleExercises.map((exercise, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-text-primary">{exercise.name}</span>
                <span className="text-xs text-text-secondary font-mono bg-surface px-2 py-1 rounded-lg border border-border">
                  {exercise.sets}× {exercise.reps}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-secondary/60 mt-3 text-center">
            + dalších {profile?.workoutDaysPerWeek || 3} dnů tréninků v týdnu
          </p>
        </Card>

        {/* Locked sections */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-text-secondary/60 uppercase tracking-wider mb-3">
            Odemkni s PRO
          </p>
          <div className="grid grid-cols-2 gap-3">
            {lockedSections.map((section) => (
              <div
                key={section.title}
                className="relative bg-surface border border-border rounded-2xl p-4 overflow-hidden"
              >
                {/* Lock overlay */}
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-2xl">
                  <svg className="w-5 h-5 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-2xl blur-sm">{section.icon}</span>
                <p className="text-sm font-semibold text-text-primary mt-1 blur-sm">{section.title}</p>
                <p className="text-xs text-text-secondary blur-sm">{section.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <div className="bg-surface2 border border-cta/30 rounded-2xl p-5 mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-cta/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔥</span>
              <span className="text-sm font-semibold text-cta">Nejoblíbenější volba</span>
            </div>
            <h3 className="text-xl font-black text-text-primary mb-1">PRO plán — 349 Kč/měs</h3>
            <p className="text-text-secondary text-sm mb-4">
              90 dní • AI kouč • Adaptivní plán • Makra a výživa
            </p>
            <Link href="/paywall">
              <Button variant="primary" fullWidth size="lg">
                {RESULTS.proCta}
              </Button>
            </Link>
            <p className="text-xs text-text-secondary/60 text-center mt-2">{RESULTS.proCtaSubtext}</p>
          </div>
        </div>

        {/* Free continue link */}
        <Link
          href="/dashboard"
          className="block text-center text-sm text-text-secondary/60 hover:text-text-secondary transition-colors py-3"
        >
          {RESULTS.freeCta} →
        </Link>
      </div>
    </div>
  );
}
