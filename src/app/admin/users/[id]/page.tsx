'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface UserDetailProfile {
  id: string;
  name: string | null;
  email: string;
  age: number | null;
  sex: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  fitness_level: string | null;
  goal: string | null;
  equipment: string | null;
  workout_days_per_week: number | null;
  dietary_preference: string | null;
  injuries: string | null;
  target_motivation: string | null;
  onboarding_completed: boolean;
  subscription_tier: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  is_platform_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface UserDetailData {
  profile: UserDetailProfile;
  activity: {
    workoutPlans: number;
    nutritionPlans: number;
    progressPhotos: number;
    aiMessages: number;
  };
}

const TIER_BADGE: Record<string, { label: string; cls: string }> = {
  free:    { label: 'Free',    cls: 'bg-surface2 border-border text-text-secondary' },
  starter: { label: 'Starter', cls: 'bg-green-500/10 border-green-500/25 text-green-400' },
  pro:     { label: 'PRO',     cls: 'bg-cta/10 border-cta/25 text-cta' },
  elite:   { label: 'Elite',   cls: 'bg-highlight/10 border-highlight/25 text-highlight' },
};

const GOAL_LABELS: Record<string, string> = {
  fat_loss:           'Hubnutí',
  muscle_gain:        'Svalový růst',
  recomposition:      'Rekompozice',
  general_fitness:    'Obecná kondice',
  improve_discipline: 'Disciplína a návyky',
  improve_appearance: 'Vzhled a sebeobraz',
};

const LEVEL_LABELS: Record<string, string> = {
  beginner:     'Začátečník',
  intermediate: 'Mírně pokročilý',
  advanced:     'Pokročilý',
};

const EQUIPMENT_LABELS: Record<string, string> = {
  none:       'Bez vybavení',
  home_basic: 'Domácí vybavení',
  gym_full:   'Plně vybavená posilovna',
};

const DIET_LABELS: Record<string, string> = {
  no_preference: 'Bez preference',
  vegetarian:    'Vegetarián',
  vegan:         'Vegan',
  keto:          'Keto',
  low_carb:      'Nízko sacharidová',
};

function ProfileField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest mb-0.5">{label}</p>
      <div className="text-sm text-text-primary">
        {value ?? <span className="text-text-secondary/25">—</span>}
      </div>
    </div>
  );
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/users/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-5 w-20 bg-surface rounded border border-border animate-shimmer" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-surface rounded-2xl border border-border animate-shimmer" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 text-center">
        <p className="text-text-secondary text-sm mb-4">Uživatel nenalezen nebo chyba při načítání.</p>
        <Link href="/admin/users" className="text-cta text-sm font-semibold hover:underline">
          ← Zpět na seznam
        </Link>
      </div>
    );
  }

  const { profile, activity } = data;
  const tier = TIER_BADGE[profile.subscription_tier] ?? TIER_BADGE.free;
  const initials = (profile.name ?? profile.email ?? '?')[0]?.toUpperCase() ?? '?';

  const formattedDate = (iso: string) =>
    new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col gap-5">

      {/* Back */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary/50 hover:text-text-secondary transition-colors w-fit"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Zpět na uživatele
      </Link>

      {/* Identity card */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-cta/12 border border-cta/20 rounded-2xl flex items-center justify-center text-xl font-black text-cta shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-lg font-black text-text-primary">
                {profile.name || '(bez jména)'}
              </h1>
              <span className={`px-2 py-0.5 border rounded text-[10px] font-bold uppercase ${tier.cls}`}>
                {tier.label}
              </span>
              {profile.is_platform_admin && (
                <span className="px-2 py-0.5 bg-highlight/10 border border-highlight/25 rounded text-[10px] font-bold text-highlight uppercase">
                  Platform Admin
                </span>
              )}
              <span className={`ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                profile.onboarding_completed
                  ? 'bg-green-500/8 border-green-500/20 text-green-400'
                  : 'bg-surface2 border-border text-text-secondary/50'
              }`}>
                {profile.onboarding_completed ? '✓ Onboarding dokončen' : '○ Onboarding nedokončen'}
              </span>
            </div>
            <p className="text-sm text-text-secondary/70 mb-1">{profile.email}</p>
            <p className="text-xs text-text-secondary/35">
              Registrován: {formattedDate(profile.created_at)}
              {' · '}
              Aktualizováno: {formattedDate(profile.updated_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Activity counters */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Trén. plány', value: activity.workoutPlans,   icon: '💪' },
          { label: 'Výž. plány',  value: activity.nutritionPlans, icon: '🥗' },
          { label: 'Fotky',       value: activity.progressPhotos, icon: '📸' },
          { label: 'AI zprávy',   value: activity.aiMessages,     icon: '🤖' },
        ].map((m) => (
          <div key={m.label} className="bg-surface border border-border rounded-xl p-3 text-center">
            <div className="text-lg mb-1">{m.icon}</div>
            <p className="text-lg font-black text-text-primary leading-none">{m.value}</p>
            <p className="text-[9px] text-text-secondary/45 mt-0.5 leading-tight">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Onboarding profile */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-cta rounded-full" />
          Onboarding profil
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <ProfileField
            label="Cíl transformace"
            value={profile.goal ? GOAL_LABELS[profile.goal] : null}
          />
          <ProfileField
            label="Úroveň kondice"
            value={profile.fitness_level ? LEVEL_LABELS[profile.fitness_level] : null}
          />
          <ProfileField
            label="Dostupné vybavení"
            value={profile.equipment ? EQUIPMENT_LABELS[profile.equipment] : null}
          />
          <ProfileField
            label="Tréninkové dny"
            value={profile.workout_days_per_week ? `${profile.workout_days_per_week}× týdně` : null}
          />
          <ProfileField
            label="Věk"
            value={profile.age ? `${profile.age} let` : null}
          />
          <ProfileField
            label="Pohlaví"
            value={profile.sex === 'male' ? 'Muž' : profile.sex === 'female' ? 'Žena' : null}
          />
          <ProfileField
            label="Výška"
            value={profile.height_cm ? `${profile.height_cm} cm` : null}
          />
          <ProfileField
            label="Váha"
            value={profile.weight_kg ? `${profile.weight_kg} kg` : null}
          />
          <ProfileField
            label="Stravovací preference"
            value={profile.dietary_preference ? DIET_LABELS[profile.dietary_preference] : null}
          />
          <ProfileField
            label="Zranění / omezení"
            value={profile.injuries || null}
          />
        </div>
      </div>

      {/* Motivation — only shown if filled */}
      {profile.target_motivation && (
        <div className="bg-surface border border-cta/15 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
            <div className="w-1 h-4 bg-cta rounded-full" />
            Motivace vlastními slovy
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed italic">
            „{profile.target_motivation}"
          </p>
        </div>
      )}

      {/* Account & billing */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-highlight rounded-full" />
          Účet & Předplatné
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <ProfileField
            label="Subscription tier"
            value={
              <span className={`inline-flex px-2 py-0.5 border rounded text-[10px] font-bold uppercase ${tier.cls}`}>
                {tier.label}
              </span>
            }
          />
          <ProfileField
            label="Stripe Customer ID"
            value={
              profile.stripe_customer_id
                ? <span className="font-mono text-xs text-text-secondary/60">{profile.stripe_customer_id}</span>
                : null
            }
          />
          <ProfileField
            label="Stripe Subscription ID"
            value={
              profile.stripe_subscription_id
                ? <span className="font-mono text-xs text-text-secondary/60">{profile.stripe_subscription_id}</span>
                : null
            }
          />
          <ProfileField
            label="User UUID"
            value={<span className="font-mono text-xs text-text-secondary/35">{profile.id}</span>}
          />
        </div>
      </div>

    </div>
  );
}
