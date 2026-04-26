'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { RESULTS } from '@/constants/copy';
import { PLANS } from '@/constants/plans';
import { supabase } from '@/lib/supabase/client';
import type { FreeWelcomeAnalysis } from '@/lib/openai';

interface ParsedSummary {
  text?: string;
  freeAnalysis?: FreeWelcomeAnalysis;
}

interface WorkoutPlanData {
  weeks?: Array<{
    days: Array<{
      isRestDay: boolean;
      workoutType?: string;
      exercises: Array<{ name: string; sets: number; reps: string }>;
    }>;
  }>;
}

// ── Goal / track helpers ──────────────────────────────────────────────────────

const GOAL_LABELS: Record<string, { label: string; icon: string; track: string }> = {
  fat_loss:            { label: 'Spalování tuku',   icon: '🔥', track: 'Tělesná transformace' },
  muscle_gain:         { label: 'Nabírání svalů',   icon: '💪', track: 'Tělesná transformace' },
  recomposition:       { label: 'Rekompozice',       icon: '⚡', track: 'Tělesná transformace' },
  improve_appearance:  { label: 'Zlepšit vzhled',   icon: '✨', track: 'Vzhled & Sebeobraz' },
  general_fitness:     { label: 'Celková kondice',  icon: '🏃', track: 'Vzhled & kondice' },
  improve_discipline:  { label: 'Disciplína',        icon: '🎯', track: 'Disciplína & Návyky' },
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Začátečník', intermediate: 'Pokročilý', advanced: 'Expert', athlete: 'Atlet',
};

const EQUIPMENT_LABELS: Record<string, string> = {
  none: 'Bez vybavení', home_basic: 'Domácí gym', gym_full: 'Plné vybavení',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function AnalysisRow({
  icon,
  label,
  body,
  highlight = false,
}: {
  icon: string;
  label: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
        highlight ? 'bg-cta/20 border border-cta/40' : 'bg-surface2 border border-border'
      }`}>
        <span className="text-sm">{icon}</span>
      </div>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
          highlight ? 'text-cta' : 'text-text-secondary/60'
        }`}>
          {label}
        </p>
        <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="w-8 h-8 bg-surface2 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-2.5 bg-surface2 rounded w-1/4" />
            <div className="h-3 bg-surface2 rounded w-full" />
            <div className="h-3 bg-surface2 rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FallbackAnalysis({ profile }: { profile: { workoutDaysPerWeek?: number } | null }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-primary font-semibold border-l-2 border-cta pl-3">
        Tvůj profil je nastaven. Začínáme.
      </p>
      <AnalysisRow icon="📍" label="Kde začínáš" body="Na základě tvého profilu máme přesný výchozí bod. Úroveň, vybavení i cíl jsou zohledněny v plánu." />
      <AnalysisRow icon="🎯" label="Hlavní příležitost" body="Konzistence v prvních 4 týdnech je klíčová — to je moment, kdy se z tréninku stane zvyk." highlight />
      <AnalysisRow icon="💪" label="Tréninkový směr" body="Silový trénink s progresivním přetížením je základ pro jakýkoli cíl — ať chceš hubnout nebo nabírat." />
      <AnalysisRow icon="🥦" label="Výživový směr" body="Bílkoviny min. 1,6 g/kg hmotnosti a hydratace 2,5 l denně jsou dvě věci s okamžitým efektem." />
      <AnalysisRow icon="🔁" label="Návyk pro první týden" body="Každý večer si připrav věci na trénink na druhý den. Odstraníš rozhodovací bariéru ráno." />
      <AnalysisRow icon="▶️" label="Příští krok" body={`Naplánuj si první trénink na konkrétní den a hodinu — ne "brzy". Konkrétní plán zvyšuje dokončení o 40 %.`} highlight />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const { profile } = useAuth();
  const [freeAnalysis, setFreeAnalysis] = useState<FreeWelcomeAnalysis | null>(null);
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
          setPlanData({ weeks: data.plan_data as WorkoutPlanData['weeks'] });
          if (data.assessment_summary) {
            try {
              const parsed = JSON.parse(data.assessment_summary) as ParsedSummary;
              if (parsed.freeAnalysis) setFreeAnalysis(parsed.freeAnalysis);
            } catch { /* old plain-string format */ }
          }
        }
      } catch { /* no plan yet */ } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [profile?.id]);

  const firstDay = planData?.weeks?.[0]?.days?.find((d) => !d.isRestDay);
  const sampleExercises = firstDay?.exercises?.slice(0, 3) || [
    { name: 'Bench press', sets: 3, reps: '8-12' },
    { name: 'Dřep s činkou', sets: 4, reps: '6-10' },
    { name: 'Mrtvý tah', sets: 3, reps: '5-8' },
  ];

  const goalInfo = profile?.goal ? GOAL_LABELS[profile.goal] : null;
  const levelLabel = profile?.fitnessLevel ? LEVEL_LABELS[profile.fitnessLevel] : null;
  const equipLabel = profile?.equipment ? EQUIPMENT_LABELS[profile.equipment] : null;

  const lockedSections = [
    { title: 'Kompletní plán', description: 'Trénink na 30–180 dní dopředu', icon: '📅' },
    { title: 'Přesná makra', description: 'Kalorie, bílkoviny, sacharidy, tuky', icon: '🥗' },
    { title: 'AI Kouč 24/7', description: 'Odpovím na cokoliv kdykoli', icon: '🤖' },
    { title: 'Adaptivní plán', description: 'Přizpůsobuje se tvému pokroku', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-7">
          <div className="relative inline-flex">
            <div className="w-16 h-16 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-glow-blue mx-auto mb-5">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-black text-text-primary mb-2">{RESULTS.title}</h1>
          <p className="text-text-secondary text-sm">{RESULTS.subtitle}</p>
        </div>

        {/* ── Profile summary card ─────────────────────────────────────────── */}
        {(goalInfo || levelLabel) && (
          <div className="relative overflow-hidden bg-surface border border-border rounded-2xl p-4 mb-5">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/40 to-transparent" />
            <div className="flex items-center gap-3 flex-wrap">
              {goalInfo && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-cta/10 border border-cta/25 rounded-xl">
                  <span className="text-base">{goalInfo.icon}</span>
                  <div>
                    <p className="text-[10px] font-bold text-cta/70 uppercase tracking-wider leading-none mb-0.5">{goalInfo.track}</p>
                    <p className="text-xs font-bold text-text-primary">{goalInfo.label}</p>
                  </div>
                </div>
              )}
              {levelLabel && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface2 border border-border rounded-xl">
                  <span className="text-sm">🏋️</span>
                  <p className="text-xs font-semibold text-text-secondary">{levelLabel}</p>
                </div>
              )}
              {equipLabel && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface2 border border-border rounded-xl">
                  <span className="text-sm">🏠</span>
                  <p className="text-xs font-semibold text-text-secondary">{equipLabel}</p>
                </div>
              )}
              {profile?.workoutDaysPerWeek && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface2 border border-border rounded-xl">
                  <span className="text-sm">📅</span>
                  <p className="text-xs font-semibold text-text-secondary">{profile.workoutDaysPerWeek}× týdně</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── AI Analysis card ─────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-surface border border-cta/25 rounded-2xl p-5 mb-5">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-cta/4 via-transparent to-highlight/4 pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-gradient-cta flex items-center justify-center shadow-glow-blue">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-text-primary">Tvoje osobní analýza od Get Beter</span>
              <span className="ml-auto px-2 py-0.5 bg-green-900/30 border border-green-700/40 rounded-full text-xs text-green-400 font-semibold">
                Zdarma
              </span>
            </div>

            {loading ? (
              <AnalysisSkeleton />
            ) : freeAnalysis ? (
              <div className="flex flex-col gap-4">
                <p className="text-text-primary font-semibold text-base border-l-2 border-cta pl-3 leading-snug">
                  {freeAnalysis.greeting}
                </p>
                <AnalysisRow icon="📍" label="Kde začínáš" body={freeAnalysis.startingPoint} />
                <AnalysisRow icon="⚠️" label="Hlavní překážka" body={freeAnalysis.mainBottleneck} highlight />
                <AnalysisRow icon="🎯" label="Klíčová příležitost" body={freeAnalysis.focusArea} highlight />
                <div className="border-t border-border/60 my-1" />
                <AnalysisRow icon="💪" label="Tréninkový směr" body={freeAnalysis.trainingDirection} />
                <AnalysisRow icon="🥦" label="Výživový směr" body={freeAnalysis.nutritionDirection} />
                <div className="border-t border-border/60 my-1" />
                <AnalysisRow icon="🔁" label="Návyk pro první týden" body={freeAnalysis.habitFocus} />
                <AnalysisRow icon="▶️" label="Příští krok" body={freeAnalysis.nextStep} highlight />
                <div className="mt-1 p-3 bg-cta/10 border border-cta/25 rounded-xl">
                  <p className="text-sm text-highlight font-medium leading-relaxed">{freeAnalysis.motivationalCta}</p>
                </div>
                {freeAnalysis.premiumTeaser && (
                  <div className="flex items-start gap-2 p-3 bg-surface2 border border-border rounded-xl">
                    <span className="text-base shrink-0 mt-0.5">🔓</span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      <span className="text-text-primary font-semibold">PRO plán: </span>
                      {freeAnalysis.premiumTeaser}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <FallbackAnalysis profile={profile} />
            )}
          </div>
        </div>

        {/* ── Sample workout ───────────────────────────────────────────────── */}
        <div className="bg-surface border border-border rounded-2xl p-5 mb-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-text-primary">{RESULTS.sampleWorkout}</h3>
            <span className="text-xs px-2 py-0.5 bg-surface2 border border-border rounded-full text-text-secondary/60">
              Ukázka
            </span>
          </div>
          <p className="text-xs text-text-secondary mb-4">Cviky z prvního týdne tvého plánu</p>
          <div className="flex flex-col gap-1">
            {sampleExercises.map((exercise, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-md bg-cta/10 border border-cta/20 flex items-center justify-center text-[10px] font-bold text-cta shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-text-primary font-medium">{exercise.name}</span>
                </div>
                <span className="text-xs text-text-secondary font-mono bg-surface2 px-2 py-1 rounded-lg border border-border">
                  {exercise.sets}× {exercise.reps}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-secondary/60 mt-3 text-center">
            Plný plán na {profile?.workoutDaysPerWeek || 3} dní/týden — odemkni PRO nebo Starter
          </p>
        </div>

        {/* ── Locked premium sections ──────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-xs font-bold text-text-secondary/50 uppercase tracking-wider mb-3">
            Dostupné s Starter nebo PRO
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {lockedSections.map((section) => (
              <div
                key={section.title}
                className="relative bg-surface border border-border rounded-2xl p-4 overflow-hidden"
              >
                {/* Blur overlay */}
                <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-2xl gap-1.5">
                  <div className="w-8 h-8 rounded-xl bg-cta/15 border border-cta/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-cta/70 uppercase tracking-wider">Zamčeno</span>
                </div>
                <span className="text-2xl select-none">{section.icon}</span>
                <p className="text-sm font-semibold text-text-primary mt-1">{section.title}</p>
                <p className="text-xs text-text-secondary">{section.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Plan comparison upsell ───────────────────────────────────────── */}
        <div className="mb-4 space-y-3">
          {/* PRO — primary */}
          <div className="relative overflow-hidden bg-surface border border-cta/40 rounded-2xl p-5">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-cta/5 to-highlight/5 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-cta/20 border border-cta/30 rounded-full text-xs font-bold text-cta uppercase tracking-wide">
                  Nejoblíbenější
                </span>
                {goalInfo && (
                  <span className="text-xs text-text-secondary/60">
                    Ideální pro: {goalInfo.label}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-text-primary mb-0.5">
                PRO plán
              </h3>
              <p className="text-2xl font-black text-cta mb-1">
                {PLANS.pro.priceLabel}
              </p>
              <p className="text-text-secondary text-sm mb-4">
                {PLANS.pro.duration} dní · AI kouč · Adaptivní plán · Přesná makra
              </p>
              <Link href="/paywall">
                <Button variant="primary" fullWidth size="lg">
                  Odemknout PRO →
                </Button>
              </Link>
              <p className="text-xs text-text-secondary/50 text-center mt-2">{RESULTS.proCtaSubtext}</p>
            </div>
          </div>

          {/* Starter — secondary option */}
          <div className="bg-surface border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-text-primary">Starter plán</p>
                <p className="text-xs text-text-secondary mt-0.5">60 dní · Plán + makra · bez AI kouče</p>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-text-primary">{PLANS.starter.priceLabel}</p>
                <Link href="/paywall">
                  <button className="text-xs text-cta hover:text-highlight transition-colors font-semibold mt-0.5">
                    Zobrazit →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Free continue ────────────────────────────────────────────────── */}
        <Link
          href="/dashboard"
          className="block text-center text-sm text-text-secondary/50 hover:text-text-secondary transition-colors py-3"
        >
          {RESULTS.freeCta} →
        </Link>

      </div>
    </div>
  );
}
