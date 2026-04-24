// B2B org plan definitions for getbeter.
// All org-level plan logic (limits, feature gates, labels) lives here.
// Components and API routes must read from this file — never hardcode plan logic inline.

import type { OrgPlan } from '@/types';

// ─── Plan limits ─────────────────────────────────────────────────────────────

export interface OrgPlanLimits {
  /** Maximum active end users / members. -1 = unlimited. */
  maxMembers: number;
  /** Maximum staff seats (coaches + admins, excluding owner). -1 = unlimited. */
  maxStaffSeats: number;
  /** AI coach messages available per member per day. -1 = unlimited. */
  aiMessagesPerMemberPerDay: number;
}

export const ORG_PLAN_LIMITS: Record<OrgPlan, OrgPlanLimits> = {
  free:       { maxMembers: 10,  maxStaffSeats: 1,  aiMessagesPerMemberPerDay: 3  },
  starter:    { maxMembers: 50,  maxStaffSeats: 3,  aiMessagesPerMemberPerDay: 10 },
  pro:        { maxMembers: 250, maxStaffSeats: 10, aiMessagesPerMemberPerDay: 25 },
  enterprise: { maxMembers: -1,  maxStaffSeats: -1, aiMessagesPerMemberPerDay: -1 },
};

// ─── Plan feature gates ───────────────────────────────────────────────────────
// Maps feature key → minimum plan required (and all plans above it).
// Use canOrgAccessFeature() from lib/entitlements.ts — never check this directly.

export const ORG_FEATURE_GATES: Record<string, OrgPlan[]> = {
  // Member management
  bulk_invite:           ['starter', 'pro', 'enterprise'],
  member_reporting:      ['pro', 'enterprise'],

  // Content & programs
  custom_programs:       ['starter', 'pro', 'enterprise'],

  // Analytics & insights
  advanced_analytics:    ['pro', 'enterprise'],
  export_data:           ['pro', 'enterprise'],

  // AI features
  ai_usage_extended:     ['pro', 'enterprise'],

  // Branding & delivery
  branded_experience:    ['pro', 'enterprise'],
  white_label:           ['enterprise'],

  // Platform
  integrations:          ['enterprise'],
  priority_support:      ['pro', 'enterprise'],
  dedicated_onboarding:  ['enterprise'],
};

// ─── Plan labels (UI) ────────────────────────────────────────────────────────

export interface OrgPlanMeta {
  name: string;
  description: string;
  color: string;   // Tailwind classes for badge
}

export const ORG_PLAN_META: Record<OrgPlan, OrgPlanMeta> = {
  free:       { name: 'Free',       description: 'Základní přístup, vhodný pro menší týmy',           color: 'bg-surface2 text-text-secondary border-border'              },
  starter:    { name: 'Starter',    description: 'Pro rostoucí koučinky a studia',                    color: 'bg-blue-900/40 text-blue-400 border-blue-700/40'            },
  pro:        { name: 'Pro',        description: 'Pro profesionální organizace a větší týmy',          color: 'bg-[#B3263E]/20 text-[#B3263E] border-[#B3263E]/40'        },
  enterprise: { name: 'Enterprise', description: 'Neomezené možnosti, dedikovaná podpora',            color: 'bg-yellow-900/40 text-yellow-400 border-yellow-700/40'     },
};

// ─── Business goal labels (UI) ────────────────────────────────────────────────

import type { OrgBusinessGoal } from '@/types';

export const ORG_BUSINESS_GOAL_META: Record<OrgBusinessGoal, { label: string; description: string; emoji: string }> = {
  member_retention:          { label: 'Udržení členů',              description: 'Zvýšit loajalitu a snížit odchody',                emoji: '🔄' },
  premium_upsell:            { label: 'Prémiový upsell',            description: 'Převádět členy na placené produkty a služby',      emoji: '⬆️' },
  operational_leverage:      { label: 'Provozní efektivita',        description: 'Automatizovat a škálovat obsluhu klientů',         emoji: '⚙️' },
  personalization_at_scale:  { label: 'Personalizace ve velkém',    description: 'Poskytovat individuální zkušenost stovkám lidí',   emoji: '🎯' },
  content_delivery:          { label: 'Doručování obsahu',          description: 'Distribuovat programy, plány a kurzy',             emoji: '📦' },
  other:                     { label: 'Jiný cíl',                   description: 'Vlastní nebo kombinovaný záměr',                   emoji: '📋' },
};

// ─── Org type labels (UI) ─────────────────────────────────────────────────────

import type { OrgType } from '@/types';

export const ORG_TYPE_META: Record<OrgType, { label: string; emoji: string }> = {
  gym:      { label: 'Posilovna / Studio',        emoji: '🏢' },
  coach:    { label: 'Trenér / Koučink',           emoji: '🏋️' },
  brand:    { label: 'Wellness značka',            emoji: '✨' },
  employer: { label: 'Zaměstnavatel',              emoji: '🏗️' },
  program:  { label: 'Transformační program',      emoji: '🚀' },
  other:    { label: 'Jiný typ',                   emoji: '📁' },
};
