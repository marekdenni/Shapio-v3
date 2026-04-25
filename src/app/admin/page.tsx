'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface AdminStats {
  total: number;
  byTier: Record<string, number>;
  byGoal: Record<string, number>;
  onboardingCompleted: number;
  onboardingRate: number;
  recentSignups: number;
  paidUsers: number;
}

const TIER_META: Record<string, { label: string; barClass: string; textClass: string }> = {
  free:    { label: 'Free',    barClass: 'bg-surface2 border border-border/60', textClass: 'text-text-secondary/60' },
  starter: { label: 'Starter', barClass: 'bg-green-500',  textClass: 'text-green-400' },
  pro:     { label: 'PRO',     barClass: 'bg-cta',        textClass: 'text-cta' },
  elite:   { label: 'Elite',   barClass: 'bg-highlight',  textClass: 'text-highlight' },
};

const GOAL_LABELS: Record<string, string> = {
  fat_loss:           'Hubnutí',
  muscle_gain:        'Svalový růst',
  recomposition:      'Rekompozice',
  general_fitness:    'Kondice',
  improve_discipline: 'Disciplína',
  improve_appearance: 'Vzhled',
};

function StatCard({ label, value, sub, accentClass }: { label: string; value: string | number; sub: string; accentClass: string }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <p className={`text-2xl font-black ${accentClass}`}>{value}</p>
      <p className="text-xs font-semibold text-text-primary mt-0.5">{label}</p>
      <p className="text-[10px] text-text-secondary/50 mt-0.5">{sub}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then(setStats)
      .catch((e) => setError(`Nepodařilo se načíst data (${e.message}).`))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-6 w-48 bg-surface rounded-lg border border-border animate-shimmer" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-surface rounded-2xl border border-border animate-shimmer" />
          ))}
        </div>
        <div className="h-48 bg-surface rounded-2xl border border-border animate-shimmer" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 text-center">
        <p className="text-text-secondary text-sm">{error ?? 'Žádná data.'}</p>
      </div>
    );
  }

  const conversionRate = stats.total > 0 ? Math.round((stats.paidUsers / stats.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">

      {/* Title */}
      <div>
        <h1 className="text-xl font-black text-text-primary">Platform Overview</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Přehled platformy — real-time data z databáze
        </p>
      </div>

      {/* Top-line metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Celkem uživatelů"
          value={stats.total}
          sub="registrovaných účtů"
          accentClass="text-text-primary"
        />
        <StatCard
          label="Platící uživatelé"
          value={stats.paidUsers}
          sub={`${conversionRate}% konverzní poměr`}
          accentClass="text-cta"
        />
        <StatCard
          label="Nových za 7 dní"
          value={stats.recentSignups}
          sub="nových registrací"
          accentClass="text-green-400"
        />
        <StatCard
          label="Onboarding rate"
          value={`${stats.onboardingRate}%`}
          sub={`${stats.onboardingCompleted} dokončeno`}
          accentClass="text-highlight"
        />
      </div>

      {/* Plan distribution */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <h2 className="text-sm font-bold text-text-primary mb-4">Distribuce plánů</h2>
        <div className="flex flex-col gap-3">
          {(['free', 'starter', 'pro', 'elite'] as const).map((tier) => {
            const count = stats.byTier[tier] ?? 0;
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            const meta = TIER_META[tier];
            return (
              <div key={tier} className="flex items-center gap-3">
                <span className={`w-14 text-xs font-bold shrink-0 ${meta.textClass}`}>{meta.label}</span>
                <div className="flex-1 h-2 bg-surface2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${meta.barClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-20 text-right shrink-0">
                  <span className="text-xs font-semibold text-text-primary">{count}</span>
                  <span className="text-[10px] text-text-secondary/40 ml-1">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal distribution */}
      {Object.keys(stats.byGoal).length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h2 className="text-sm font-bold text-text-primary mb-4">Distribuce cílů uživatelů</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(stats.byGoal)
              .sort(([, a], [, b]) => b - a)
              .map(([goal, count]) => (
                <div key={goal} className="bg-surface2 border border-border rounded-xl p-3">
                  <p className="text-lg font-black text-text-primary">{count}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{GOAL_LABELS[goal] ?? goal}</p>
                  <p className="text-[10px] text-text-secondary/40 mt-0.5">
                    {stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Quick navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Link
          href="/admin/users"
          className="bg-surface border border-border rounded-2xl p-4 hover:border-cta/30 hover:bg-surface2/40 transition-all group"
        >
          <div className="w-9 h-9 bg-cta/10 border border-cta/20 rounded-xl flex items-center justify-center text-lg mb-3">
            👥
          </div>
          <p className="text-sm font-bold text-text-primary group-hover:text-cta transition-colors">Správa uživatelů</p>
          <p className="text-xs text-text-secondary mt-0.5">{stats.total} zákazníků v databázi</p>
        </Link>

        <div className="bg-surface border border-border rounded-2xl p-4 opacity-50 cursor-not-allowed">
          <div className="w-9 h-9 bg-surface2 border border-border rounded-xl flex items-center justify-center text-lg mb-3">
            💳
          </div>
          <p className="text-sm font-bold text-text-primary">Předplatná</p>
          <p className="text-xs text-text-secondary mt-0.5">Stripe integrace — brzy</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 opacity-50 cursor-not-allowed">
          <div className="w-9 h-9 bg-surface2 border border-border rounded-xl flex items-center justify-center text-lg mb-3">
            📈
          </div>
          <p className="text-sm font-bold text-text-primary">Analytika</p>
          <p className="text-xs text-text-secondary mt-0.5">Engagement metriky — brzy</p>
        </div>
      </div>

    </div>
  );
}
