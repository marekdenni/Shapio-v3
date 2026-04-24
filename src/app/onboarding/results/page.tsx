'use client';

// Results page shown after onboarding AI analysis
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { RESULTS } from '@/constants/copy';
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

// Individual analysis row with icon, label, and body text
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
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${highlight ? 'bg-[#B3263E]/20 border border-[#B3263E]/40' : 'bg-[#1D1D22] border border-[#2A2A31]'}`}>
        <span className="text-sm">{icon}</span>
      </div>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${highlight ? 'text-[#B3263E]' : 'text-[#71717A]'}`}>
          {label}
        </p>
        <p className="text-sm text-[#A1A1AA] leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

// Skeleton placeholder while analysis loads
function AnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="w-8 h-8 bg-[#2A2A31] rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-2.5 bg-[#2A2A31] rounded w-1/4" />
            <div className="h-3 bg-[#2A2A31] rounded w-full" />
            <div className="h-3 bg-[#2A2A31] rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Fallback analysis when AI generation failed or no data yet
function FallbackAnalysis({ profile }: { profile: { workoutDaysPerWeek?: number } | null }) {
  const days = profile?.workoutDaysPerWeek || 3;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[#F5F5F5] font-semibold border-l-2 border-[#B3263E] pl-3">
        Tvůj profil je nastaven. Začínáme.
      </p>
      <AnalysisRow icon="📍" label="Kde začínáš" body="Na základě tvého profilu máme přesný výchozí bod. Úroveň, vybavení i cíl jsou zohledněny v plánu." />
      <AnalysisRow icon="🎯" label="Hlavní příležitost" body="Konzistence v prvních 4 týdnech je klíčová — to je moment, kdy se z tréninku stane zvyk." />
      <AnalysisRow icon="💪" label="Tréninkový směr" body="Silový trénink s progresivním přetížením je základ pro jakýkoli cíl — ať chceš hubnout nebo nabírat." />
      <AnalysisRow icon="🥦" label="Výživový směr" body={`Bílkoviny min. 1,6 g/kg hmotnosti a hydratace 2,5 l denně jsou dvě věci s okamžitým efektem.`} />
      <AnalysisRow icon="🔁" label="Návyk pro první týden" body="Každý večer si připrav věci na trénink na druhý den. Odstraníš rozhodovací bariéru ráno." />
      <AnalysisRow icon="▶️" label="Příští krok" body={`Naplánuj si první trénink na konkrétní den a hodinu — ne "brzy". Konkrétní plán zvyšuje dokončení o 40 %.`} />
    </div>
  );
}

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
              if (parsed.freeAnalysis) {
                setFreeAnalysis(parsed.freeAnalysis);
              }
            } catch {
              // old plain-string format — no structured analysis available
            }
          }
        }
      } catch {
        // no plan yet — fallback content renders
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [profile?.id]);

  // Sample exercises from the generated plan (first non-rest day)
  const firstDay = planData?.weeks?.[0]?.days?.find((d) => !d.isRestDay);
  const sampleExercises = firstDay?.exercises?.slice(0, 3) || [
    { name: 'Bench press', sets: 3, reps: '8-12' },
    { name: 'Dřep s činkou', sets: 4, reps: '6-10' },
    { name: 'Mrtvý tah', sets: 3, reps: '5-8' },
  ];

  const lockedSections = [
    { title: 'Kompletní plán', description: 'Trénink na 30–180 dní dopředu', icon: '📅' },
    { title: 'Přesná makra', description: 'Kalorie, bílkoviny, sacharidy, tuky', icon: '🥗' },
    { title: 'AI Kouč 24/7', description: 'Odpovím na cokoliv kdykoli', icon: '🤖' },
    { title: 'Adaptivní plán', description: 'Přizpůsobuje se tvému pokroku', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0D] py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#8B1E2D] to-[#D13A52] rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(179,38,62,0.4)] mx-auto mb-5">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-[#F5F5F5] mb-2">{RESULTS.title}</h1>
          <p className="text-[#A1A1AA] text-sm">{RESULTS.subtitle}</p>
        </div>

        {/* AI Analysis card */}
        <div className="bg-[#151518] border border-[#2A2A31] rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-[#B3263E]/20 border border-[#B3263E]/40 flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <span className="text-sm font-semibold text-[#F5F5F5]">Tvoje osobní analýza od getbeter</span>
            <span className="ml-auto px-2 py-0.5 bg-green-900/30 border border-green-700/40 rounded-full text-xs text-green-400 font-semibold">
              Zdarma
            </span>
          </div>

          {loading ? (
            <AnalysisSkeleton />
          ) : freeAnalysis ? (
            <div className="flex flex-col gap-4">
              {/* Greeting — prominent */}
              <p className="text-[#F5F5F5] font-semibold text-base border-l-2 border-[#B3263E] pl-3 leading-snug">
                {freeAnalysis.greeting}
              </p>

              <AnalysisRow icon="📍" label="Kde začínáš" body={freeAnalysis.startingPoint} />
              <AnalysisRow icon="⚠️" label="Hlavní překážka" body={freeAnalysis.mainBottleneck} highlight />
              <AnalysisRow icon="🎯" label="Klíčová příležitost" body={freeAnalysis.focusArea} highlight />

              {/* Divider */}
              <div className="border-t border-[#2A2A31] my-1" />

              <AnalysisRow icon="💪" label="Tréninkový směr" body={freeAnalysis.trainingDirection} />
              <AnalysisRow icon="🥦" label="Výživový směr" body={freeAnalysis.nutritionDirection} />

              {/* Divider */}
              <div className="border-t border-[#2A2A31] my-1" />

              <AnalysisRow icon="🔁" label="Návyk pro první týden" body={freeAnalysis.habitFocus} />
              <AnalysisRow icon="▶️" label="Příští krok" body={freeAnalysis.nextStep} />

              {/* Motivational close */}
              <div className="mt-1 p-3 bg-[#B3263E]/10 border border-[#B3263E]/30 rounded-xl">
                <p className="text-sm text-[#D13A52] font-medium leading-relaxed">
                  {freeAnalysis.motivationalCta}
                </p>
              </div>

              {/* Premium teaser */}
              {freeAnalysis.premiumTeaser && (
                <div className="flex items-start gap-2 p-3 bg-[#1D1D22] border border-[#2A2A31] rounded-xl">
                  <span className="text-base shrink-0 mt-0.5">🔓</span>
                  <p className="text-xs text-[#71717A] leading-relaxed">
                    <span className="text-[#A1A1AA] font-semibold">PRO plán: </span>
                    {freeAnalysis.premiumTeaser}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <FallbackAnalysis profile={profile} />
          )}
        </div>

        {/* Sample workout preview */}
        <div className="bg-[#151518] border border-[#2A2A31] rounded-2xl p-5 mb-5">
          <h3 className="text-sm font-semibold text-[#F5F5F5] mb-1">{RESULTS.sampleWorkout}</h3>
          <p className="text-xs text-[#71717A] mb-4">Ukázka z prvního týdne tvého plánu</p>
          <div className="flex flex-col gap-2">
            {sampleExercises.map((exercise, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#2A2A31] last:border-0">
                <span className="text-sm text-[#F5F5F5]">{exercise.name}</span>
                <span className="text-xs text-[#A1A1AA] font-mono bg-[#1D1D22] px-2 py-1 rounded-lg border border-[#2A2A31]">
                  {exercise.sets}× {exercise.reps}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#71717A] mt-3 text-center">
            Plný plán na {profile?.workoutDaysPerWeek || 3} dní/týden — odemkni PRO nebo STARTER
          </p>
        </div>

        {/* Locked premium sections */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-3">
            Dostupné s PRO nebo STARTER
          </p>
          <div className="grid grid-cols-2 gap-3">
            {lockedSections.map((section) => (
              <div
                key={section.title}
                className="relative bg-[#151518] border border-[#2A2A31] rounded-2xl p-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-[#0B0B0D]/60 flex items-center justify-center rounded-2xl">
                  <svg className="w-5 h-5 text-[#B3263E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-2xl blur-sm select-none">{section.icon}</span>
                <p className="text-sm font-semibold text-[#F5F5F5] mt-1 blur-sm select-none">{section.title}</p>
                <p className="text-xs text-[#A1A1AA] blur-sm select-none">{section.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main upgrade CTA */}
        <div className="bg-[#151518] border border-[#B3263E]/30 rounded-2xl p-5 mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B3263E]/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔥</span>
              <span className="text-sm font-semibold text-[#B3263E]">Nejoblíbenější volba</span>
            </div>
            <h3 className="text-xl font-black text-[#F5F5F5] mb-1">PRO plán — 349 Kč/měs</h3>
            <p className="text-[#A1A1AA] text-sm mb-4">
              90 dní · AI kouč · Adaptivní plán · Přesná makra
            </p>
            <Link href="/paywall">
              <Button variant="primary" fullWidth size="lg">
                {RESULTS.proCta}
              </Button>
            </Link>
            <p className="text-xs text-[#A1A1AA]/60 text-center mt-2">{RESULTS.proCtaSubtext}</p>
          </div>
        </div>

        {/* Free continue */}
        <Link
          href="/dashboard"
          className="block text-center text-sm text-[#71717A] hover:text-[#A1A1AA] transition-colors py-3"
        >
          {RESULTS.freeCta} →
        </Link>
      </div>
    </div>
  );
}
