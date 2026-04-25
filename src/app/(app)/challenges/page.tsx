'use client';

// Challenges page — structured challenge tracks for the user.
// 7-day starter: live (derived from plan data).
// 30-day consistency and 90-day transformation: staged for upcoming release.
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StarterChallenge } from '@/components/dashboard/StarterChallenge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';

interface PlanMeta {
  planCreatedAt: string;
  durationDays: number;
}

function calcDaysSince(isoDate: string): number {
  const start = new Date(isoDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ChallengesPage() {
  const { profile } = useAuth();
  const [planMeta, setPlanMeta] = useState<PlanMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeta = async () => {
      if (!profile?.id) return;
      try {
        const { data } = await supabase
          .from('workout_plans')
          .select('created_at, duration_days')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (data) {
          setPlanMeta({ planCreatedAt: data.created_at, durationDays: data.duration_days ?? 30 });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const daysPerWeek = profile?.workoutDaysPerWeek ?? 3;
  const daysSince = planMeta ? calcDaysSince(planMeta.planCreatedAt) : 0;
  const programDayNum = planMeta ? Math.min(daysSince + 1, planMeta.durationDays) : 1;
  const programPercent = planMeta
    ? Math.round((programDayNum / planMeta.durationDays) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-black text-text-primary">Výzvy</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          Strukturované kroky k tvé transformaci
        </p>
      </div>

      {/* ── 7-day starter challenge (live) ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-md bg-cta/20 border border-cta/30 flex items-center justify-center text-xs">🏁</span>
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">7denní starter</h2>
          <span className="px-2 py-0.5 rounded-full bg-green-900/30 border border-green-700/40 text-xs text-green-400 font-semibold ml-auto">Aktivní</span>
        </div>

        {loading ? (
          <div className="bg-surface border border-border rounded-2xl p-4 animate-shimmer h-28" />
        ) : planMeta ? (
          <StarterChallenge
            planCreatedAt={planMeta.planCreatedAt}
            workoutDaysPerWeek={daysPerWeek}
          />
        ) : (
          <div className="bg-surface border border-border rounded-2xl p-5 text-center">
            <p className="text-sm text-text-secondary mb-3">
              Nejdřív dokonči onboarding — AI sestaví plán a výzva se spustí automaticky.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex px-4 py-2 bg-cta text-white text-sm font-semibold rounded-xl hover:bg-highlight transition-colors"
            >
              Dokončit onboarding
            </Link>
          </div>
        )}
      </section>

      {/* ── 90-day transformation (live plan progress) ── */}
      {planMeta && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-md bg-highlight/20 border border-highlight/30 flex items-center justify-center text-xs">🎯</span>
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
              {planMeta.durationDays}denní transformace
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-cta/10 border border-cta/20 text-xs text-cta font-semibold ml-auto">
              {programPercent}%
            </span>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-text-primary">Den {programDayNum} z {planMeta.durationDays}</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {programPercent < 25
                    ? 'Začínáš — soustřeď se na vytváření návyku.'
                    : programPercent < 50
                    ? 'Dobrý pokrok — tělo se přizpůsobuje.'
                    : programPercent < 75
                    ? 'Více než polovina za sebou — výsledky jsou vidět.'
                    : programPercent < 100
                    ? 'Závěrečná fáze — výsledky se projevují naplno.'
                    : 'Program dokončen — gratulujeme!'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-cta">{programPercent}%</p>
                <p className="text-xs text-text-secondary">pokroku</p>
              </div>
            </div>

            {/* Progress track */}
            <div className="h-2 bg-surface2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-cta rounded-full transition-all duration-500"
                style={{ width: `${programPercent}%` }}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-text-secondary">
                Tréninkový plán aktivní od zahájení onboardingu
              </p>
              <Link href="/plan" className="text-xs text-cta hover:text-highlight transition-colors font-semibold">
                Zobrazit plán →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 30-day consistency challenge (staged) ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-md bg-surface2 border border-border flex items-center justify-center text-xs">📅</span>
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">30denní konzistence</h2>
          <span className="px-2 py-0.5 rounded-full bg-surface2 border border-border text-xs text-text-secondary/60 font-semibold ml-auto">Připravujeme</span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cta/3 to-highlight/3 pointer-events-none" />
          <div className="relative">
            <p className="text-base font-bold text-text-primary mb-2">Buduj konzistenci 30 dní v řadě</p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Denní check-in, streak tracking a mikro-cíle navržené tak, aby tě udržely v pohybu každý den — bez výmluv.
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                'Denní check-in s automatickým hodnocením',
                'Streak counter s vizuálním motivátorem',
                'Mikro-odměny za splnění milníků',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-text-secondary">
                  <span className="w-4 h-4 rounded bg-cta/10 flex items-center justify-center text-cta shrink-0 mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-text-secondary/50">Bude dostupné v příštím update platformy.</p>
          </div>
        </div>
      </section>

      {/* ── Community challenges (staged) ── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-md bg-surface2 border border-border flex items-center justify-center text-xs">🏆</span>
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Komunitní výzvy</h2>
          <span className="px-2 py-0.5 rounded-full bg-surface2 border border-border text-xs text-text-secondary/60 font-semibold ml-auto">Připravujeme</span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-highlight/3 to-cta/3 pointer-events-none" />
          <div className="relative">
            <p className="text-base font-bold text-text-primary mb-2">Výzvy s ostatními uživateli</p>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Přidej se k časově omezeným výzvám — tlačenky, kardio sprinty, kaloricí challenge. Soutěž s přáteli nebo s celou komunitou.
            </p>
            <ul className="space-y-1.5">
              {[
                'Skupinové výzvy s žebříčkem',
                'Sdílení výsledků a pokroku',
                'Speciální odměny za vítěze',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-text-secondary">
                  <span className="w-4 h-4 rounded bg-highlight/10 flex items-center justify-center text-highlight shrink-0 mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}
