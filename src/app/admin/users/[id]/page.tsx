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
  activity_level: string | null;
  session_duration_minutes: number | null;
  main_frictions: string[] | null;
  interest_signals: string[] | null;
  selected_track: string | null;
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
  latestAssessment: { text: string; freeAnalysis: unknown } | null;
}

// ─── Label maps ──────────────────────────────────────────────────────────────

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

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary:        'Sedavý (kancelář)',
  lightly_active:   'Mírně aktivní',
  moderately_active:'Středně aktivní',
  very_active:      'Velmi aktivní',
};

const FRICTION_LABELS: Record<string, string> = {
  no_time:              'Nedostatek času',
  no_motivation:        'Chybí motivace',
  no_energy:            'Nedostatek energie',
  dont_know_what_to_do: 'Neví, co dělat',
  injury_fear:          'Strach ze zranění',
  past_failures:        'Předchozí neúspěchy',
  social_anxiety:       'Sociální úzkost',
  bad_diet_habits:      'Špatné stravovací návyky',
};

const SIGNAL_LABELS: Record<string, string> = {
  ai_coaching:           'AI coaching',
  progress_tracking:     'Sledování pokroku',
  nutrition_planning:    'Plánování výživy',
  community:             'Komunita',
  challenges:            'Výzvy',
  team_coaching:         'Týmový coaching',
  corporate_wellness:    'Firemní wellness',
};

const TRACK_META: Record<string, { label: string; icon: string; desc: string; accentClass: string }> = {
  physique: {
    label: 'Tělesná transformace',
    icon: '💪',
    desc: 'Hubnutí, svalový růst nebo rekompozice.',
    accentClass: 'border-cta/30 bg-cta/5',
  },
  looks: {
    label: 'Vzhled & Sebeobraz',
    icon: '✨',
    desc: 'Estetická transformace a sebedůvěra.',
    accentClass: 'border-highlight/30 bg-highlight/5',
  },
  habits: {
    label: 'Disciplína & Návyky',
    icon: '🎯',
    desc: 'Konzistentnost a zdravý životní styl.',
    accentClass: 'border-blue-500/30 bg-blue-500/5',
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function SectionHeader({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
      <div className={`w-1 h-4 rounded-full ${accent}`} />
      {children}
    </h2>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
        {Array.from({ length: 5 }).map((_, i) => (
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

  const { profile, activity, latestAssessment } = data;
  const tier = TIER_BADGE[profile.subscription_tier] ?? TIER_BADGE.free;
  const initials = (profile.name ?? profile.email ?? '?')[0]?.toUpperCase() ?? '?';
  const track = profile.selected_track ? TRACK_META[profile.selected_track] : null;
  const frictions: string[] = Array.isArray(profile.main_frictions) ? profile.main_frictions : [];
  const signals: string[] = Array.isArray(profile.interest_signals) ? profile.interest_signals : [];

  const formattedDate = (iso: string) =>
    new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });

  // Parse freeAnalysis if present
  let freeAnalysis: Record<string, string> | null = null;
  if (latestAssessment?.freeAnalysis && typeof latestAssessment.freeAnalysis === 'object') {
    freeAnalysis = latestAssessment.freeAnalysis as Record<string, string>;
  }

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
          <div className="w-14 h-14 bg-cta/10 border border-cta/20 rounded-2xl flex items-center justify-center text-xl font-black text-cta shrink-0">
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
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
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

      {/* Transformation track */}
      {track ? (
        <div className={`border rounded-2xl p-5 ${track.accentClass}`}>
          <SectionHeader accent="bg-cta">Transformační cesta</SectionHeader>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{track.icon}</div>
            <div>
              <p className="text-sm font-bold text-text-primary">{track.label}</p>
              <p className="text-xs text-text-secondary mt-0.5">{track.desc}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl p-4">
          <SectionHeader accent="bg-border">Transformační cesta</SectionHeader>
          <p className="text-xs text-text-secondary/40">Uživatel nevybral cestu (onboarding nedokončen nebo starší účet).</p>
        </div>
      )}

      {/* Friction patterns + interest signals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Frictions */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <SectionHeader accent="bg-red-500">Překážky & problémy</SectionHeader>
          {frictions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {frictions.map((f) => (
                <span
                  key={f}
                  className="px-2.5 py-1 bg-red-950/30 border border-red-800/30 rounded-lg text-xs text-red-400 font-medium"
                >
                  {FRICTION_LABELS[f] ?? f}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-secondary/40">Žádné překážky nezaznamenány.</p>
          )}
        </div>

        {/* Interest signals */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <SectionHeader accent="bg-green-500">Zájem o funkce</SectionHeader>
          {signals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {signals.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 bg-green-950/30 border border-green-800/30 rounded-lg text-xs text-green-400 font-medium"
                >
                  {SIGNAL_LABELS[s] ?? s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-secondary/40">Žádné signály nezaznamenány.</p>
          )}
        </div>
      </div>

      {/* Onboarding profile */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <SectionHeader accent="bg-cta">Onboarding profil</SectionHeader>
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
            label="Tréninkové dny / týden"
            value={profile.workout_days_per_week ? `${profile.workout_days_per_week}×` : null}
          />
          <ProfileField
            label="Délka tréninku"
            value={profile.session_duration_minutes ? `${profile.session_duration_minutes} min` : null}
          />
          <ProfileField
            label="Aktivita (lifestyle)"
            value={profile.activity_level ? ACTIVITY_LABELS[profile.activity_level] : null}
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

      {/* Motivation */}
      {profile.target_motivation && (
        <div className="bg-surface border border-cta/15 rounded-2xl p-5">
          <SectionHeader accent="bg-cta">Motivace vlastními slovy</SectionHeader>
          <p className="text-sm text-text-secondary leading-relaxed italic">
            „{profile.target_motivation}"
          </p>
        </div>
      )}

      {/* AI Assessment summary */}
      {latestAssessment && (
        <div className="bg-surface border border-highlight/15 rounded-2xl p-5">
          <SectionHeader accent="bg-highlight">AI analýza (nejnovější plán)</SectionHeader>
          {latestAssessment.text && (
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              {latestAssessment.text}
            </p>
          )}
          {freeAnalysis && Object.keys(freeAnalysis).length > 0 && (
            <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-border/50">
              {Object.entries(freeAnalysis).map(([key, val]) => {
                if (typeof val !== 'string' || !val) return null;
                const keyLabel = key
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <div key={key}>
                    <p className="text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest mb-0.5">
                      {keyLabel}
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed">{val}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Account & billing */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <SectionHeader accent="bg-highlight">Účet & Předplatné</SectionHeader>
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
