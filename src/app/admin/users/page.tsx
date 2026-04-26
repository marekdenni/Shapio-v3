'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface AdminUserRow {
  id: string;
  name: string | null;
  email: string;
  age: number | null;
  sex: string | null;
  goal: string | null;
  fitness_level: string | null;
  equipment: string | null;
  subscription_tier: string;
  onboarding_completed: boolean;
  is_platform_admin: boolean;
  target_motivation: string | null;
  selected_track: string | null;
  main_frictions: string[] | null;
  interest_signals: string[] | null;
  activity_level: string | null;
  session_duration_minutes: number | null;
  created_at: string;
  updated_at: string;
}

const TIER_BADGE: Record<string, { label: string; cls: string }> = {
  free:    { label: 'Free',    cls: 'bg-surface2 border-border text-text-secondary/60' },
  starter: { label: 'Starter', cls: 'bg-green-500/10 border-green-500/25 text-green-400' },
  pro:     { label: 'PRO',     cls: 'bg-cta/10 border-cta/25 text-cta' },
  elite:   { label: 'Elite',   cls: 'bg-highlight/10 border-highlight/25 text-highlight' },
};

const GOAL_LABELS: Record<string, string> = {
  fat_loss:           'Hubnutí',
  muscle_gain:        'Svalový růst',
  recomposition:      'Rekompozice',
  general_fitness:    'Kondice',
  improve_discipline: 'Disciplína',
  improve_appearance: 'Vzhled',
};

const TRACK_META: Record<string, { label: string; icon: string; cls: string }> = {
  physique: { label: 'Fyzická',    icon: '💪', cls: 'text-cta' },
  looks:    { label: 'Vzhled',     icon: '✨', cls: 'text-highlight' },
  habits:   { label: 'Návyky',     icon: '🎯', cls: 'text-blue-400' },
};

const FRICTION_LABELS: Record<string, string> = {
  no_time:           'Nemá čas',
  no_motivation:     'Chybí motivace',
  no_energy:         'Nemá energii',
  dont_know_what_to_do: 'Neví co dělat',
  injury_fear:       'Strach ze zranění',
  past_failures:     'Dřívější neúspěchy',
  social_anxiety:    'Soc. úzkost',
  bad_diet_habits:   'Špatné stravování',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [trackFilter, setTrackFilter] = useState('all');
  const [onboardingFilter, setOnboardingFilter] = useState('all');

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((d) => setUsers(d.users ?? []))
      .catch((e) => setError(`Chyba při načítání (${e.message}).`))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      (u.name ?? '').toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q);
    const matchTier = tierFilter === 'all' || u.subscription_tier === tierFilter;
    const matchTrack = trackFilter === 'all' || u.selected_track === trackFilter;
    const matchOnboarding =
      onboardingFilter === 'all' ||
      (onboardingFilter === 'done' && u.onboarding_completed) ||
      (onboardingFilter === 'pending' && !u.onboarding_completed);
    return matchSearch && matchTier && matchTrack && matchOnboarding;
  });

  const paidCount = users.filter((u) => u.subscription_tier !== 'free').length;

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-black text-text-primary">Uživatelé</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {users.length} zákazníků · {paidCount} platících
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Hledat jméno nebo email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-cta/40 transition-colors"
        />
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-cta/40 transition-colors"
        >
          <option value="all">Všechny plány</option>
          <option value="free">Free</option>
          <option value="starter">Starter</option>
          <option value="pro">PRO</option>
          <option value="elite">Elite</option>
        </select>
        <select
          value={trackFilter}
          onChange={(e) => setTrackFilter(e.target.value)}
          className="px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-cta/40 transition-colors"
        >
          <option value="all">Všechny cesty</option>
          <option value="physique">💪 Fyzická</option>
          <option value="looks">✨ Vzhled</option>
          <option value="habits">🎯 Návyky</option>
        </select>
        <select
          value={onboardingFilter}
          onChange={(e) => setOnboardingFilter(e.target.value)}
          className="px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-cta/40 transition-colors"
        >
          <option value="all">Onboarding: vše</option>
          <option value="done">Dokončen</option>
          <option value="pending">Nedokončen</option>
        </select>
      </div>

      {/* Table header */}
      {!loading && filtered.length > 0 && (
        <div className="hidden lg:grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto] gap-3 px-4 py-1.5">
          <span className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest">Uživatel</span>
          <span className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest w-16 text-center">Plán</span>
          <span className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest w-20 text-center">Cesta</span>
          <span className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest w-24 text-center">Cíl</span>
          <span className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest w-16 text-center">Onboarding</span>
          <span className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest w-24 text-right">Registrace</span>
          <span className="w-5" />
        </div>
      )}

      {/* User list */}
      {loading ? (
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 bg-surface rounded-xl border border-border animate-shimmer" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-surface border border-border rounded-2xl p-8 text-center">
          <p className="text-text-secondary text-sm">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-8 text-center">
          <p className="text-text-secondary text-sm">Žádní uživatelé neodpovídají filtru.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {filtered.map((user) => {
            const tier = TIER_BADGE[user.subscription_tier] ?? TIER_BADGE.free;
            const track = user.selected_track ? TRACK_META[user.selected_track] : null;
            const initials = (user.name ?? user.email ?? '?')[0]?.toUpperCase() ?? '?';
            const regDate = new Date(user.created_at).toLocaleDateString('cs-CZ', {
              day: 'numeric', month: 'short',
            });
            const frictions = Array.isArray(user.main_frictions) ? user.main_frictions : [];

            return (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_auto_auto_auto_auto_auto] items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3 hover:border-cta/25 hover:bg-surface2/40 transition-all group"
              >
                {/* Name + email + frictions */}
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 bg-cta/10 border border-cta/20 rounded-lg flex items-center justify-center text-xs font-black text-cta shrink-0 mt-0.5">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate group-hover:text-cta transition-colors">
                      {user.name || '(bez jména)'}
                      {user.is_platform_admin && (
                        <span className="ml-1.5 px-1 py-0.5 bg-highlight/10 border border-highlight/20 rounded text-[9px] font-bold text-highlight align-middle">Admin</span>
                      )}
                    </p>
                    <p className="text-xs text-text-secondary/50 truncate">{user.email}</p>
                    {frictions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {frictions.slice(0, 2).map((f) => (
                          <span key={f} className="px-1.5 py-0.5 bg-surface2 border border-border rounded text-[9px] text-text-secondary/50">
                            {FRICTION_LABELS[f] ?? f}
                          </span>
                        ))}
                        {frictions.length > 2 && (
                          <span className="text-[9px] text-text-secondary/30">+{frictions.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tier badge */}
                <span className={`shrink-0 px-2 py-0.5 border rounded text-[10px] font-bold uppercase w-16 text-center ${tier.cls}`}>
                  {tier.label}
                </span>

                {/* Track */}
                <div className="shrink-0 hidden lg:flex justify-center w-20">
                  {track ? (
                    <span className={`text-xs font-semibold ${track.cls} flex items-center gap-1`}>
                      <span>{track.icon}</span>
                      <span className="hidden xl:inline">{track.label}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-text-secondary/25">—</span>
                  )}
                </div>

                {/* Goal */}
                <span className="shrink-0 hidden lg:block text-xs text-text-secondary/60 w-24 text-center">
                  {user.goal ? GOAL_LABELS[user.goal] : '—'}
                </span>

                {/* Onboarding */}
                <div className="shrink-0 hidden lg:flex justify-center w-16">
                  {user.onboarding_completed ? (
                    <span className="w-5 h-5 bg-green-500/12 border border-green-500/25 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-5 h-5 bg-surface2 border border-border rounded-full flex items-center justify-center">
                      <span className="text-[9px] text-text-secondary/30 font-bold">—</span>
                    </span>
                  )}
                </div>

                {/* Date */}
                <span className="shrink-0 hidden lg:block text-[10px] text-text-secondary/40 w-24 text-right">
                  {regDate}
                </span>

                {/* Arrow */}
                <svg className="w-4 h-4 text-text-secondary/25 group-hover:text-cta/60 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-[11px] text-text-secondary/35 text-center">
          {filtered.length} z {users.length} uživatelů
        </p>
      )}
    </div>
  );
}
