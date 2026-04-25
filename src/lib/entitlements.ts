// Unified entitlement resolution for getbeter
//
// Resolves feature access by considering BOTH the user's personal subscription
// tier AND the organization's plan (if the user is operating in org context).
//
// Resolution strategy:
//   1. User's personal tier always applies
//   2. If user is in an org context, the org's plan may grant additional features
//   3. The effective entitlements are the UNION of both — the user gets
//      the higher-of-the-two for any given feature
//   4. Platform admins bypass all feature gates
//
// This replaces direct calls to canAccessFeature() in new code, while
// the existing canAccessFeature() remains available for backwards compat.

import type { SubscriptionTier, OrgPlan } from '@/types';
import { FEATURE_GATES } from '@/constants/plans';
import { ORG_PLAN_LIMITS, ORG_FEATURE_GATES, type OrgPlanLimits } from '@/constants/org-plans';

// ─── Tier hierarchy ─────────────────────────────────────────────────────────

const USER_TIER_LEVELS: Record<SubscriptionTier, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  elite: 3,
};

const ORG_PLAN_LEVELS: Record<OrgPlan, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3,
};

// Map org plans to equivalent user tier for feature gate resolution.
// An org's "enterprise" plan grants the same features as a user's "elite" tier.
const ORG_PLAN_TO_USER_TIER: Record<OrgPlan, SubscriptionTier> = {
  free: 'free',
  starter: 'starter',
  pro: 'pro',
  enterprise: 'elite',
};

// ─── Entitlement context ────────────────────────────────────────────────────

export interface EntitlementContext {
  userTier: SubscriptionTier;
  orgPlan?: OrgPlan | null;
  isPlatformAdmin?: boolean;
}

// ─── Resolution ─────────────────────────────────────────────────────────────

/**
 * Returns the effective subscription tier by taking the higher of
 * the user's personal tier and the org plan (mapped to equivalent tier).
 */
export function resolveEffectiveTier(ctx: EntitlementContext): SubscriptionTier {
  if (ctx.isPlatformAdmin) return 'elite'; // Platform admins get full access

  const userLevel = USER_TIER_LEVELS[ctx.userTier];
  const orgLevel = ctx.orgPlan ? ORG_PLAN_LEVELS[ctx.orgPlan] : 0;

  if (orgLevel > userLevel) {
    return ORG_PLAN_TO_USER_TIER[ctx.orgPlan!];
  }
  return ctx.userTier;
}

/**
 * Checks if the given context has access to a specific feature.
 * Considers both user tier and org plan.
 */
export function canAccess(ctx: EntitlementContext, feature: string): boolean {
  if (ctx.isPlatformAdmin) return true;

  const effectiveTier = resolveEffectiveTier(ctx);
  const allowedTiers = FEATURE_GATES[feature];

  if (!allowedTiers) return true; // Feature not gated
  return allowedTiers.includes(effectiveTier);
}

/**
 * Returns all features the context has access to.
 */
export function getAccessibleFeatures(ctx: EntitlementContext): string[] {
  if (ctx.isPlatformAdmin) return Object.keys(FEATURE_GATES);

  const effectiveTier = resolveEffectiveTier(ctx);
  return Object.entries(FEATURE_GATES)
    .filter(([, tiers]) => tiers.includes(effectiveTier))
    .map(([feature]) => feature);
}

/**
 * Checks if the context has any paid access (personal or org-granted).
 */
export function hasPaidAccess(ctx: EntitlementContext): boolean {
  if (ctx.isPlatformAdmin) return true;
  const effectiveTier = resolveEffectiveTier(ctx);
  return effectiveTier !== 'free';
}

/**
 * Checks if the context has pro-level access or above.
 */
export function hasProAccess(ctx: EntitlementContext): boolean {
  if (ctx.isPlatformAdmin) return true;
  const effectiveTier = resolveEffectiveTier(ctx);
  return USER_TIER_LEVELS[effectiveTier] >= USER_TIER_LEVELS.pro;
}

/**
 * Checks if the context has starter-level access or above.
 */
export function hasStarterAccess(ctx: EntitlementContext): boolean {
  if (ctx.isPlatformAdmin) return true;
  const effectiveTier = resolveEffectiveTier(ctx);
  return USER_TIER_LEVELS[effectiveTier] >= USER_TIER_LEVELS.starter;
}

/**
 * Returns the next upgrade target tier for a given effective tier.
 * Returns null if already at the highest tier.
 */
export function getUpgradeTarget(ctx: EntitlementContext): SubscriptionTier | null {
  const effective = resolveEffectiveTier(ctx);
  const level = USER_TIER_LEVELS[effective];
  const next = Object.entries(USER_TIER_LEVELS).find(([, l]) => l === level + 1);
  return next ? (next[0] as SubscriptionTier) : null;
}

// ─── B2B org-level limits ────────────────────────────────────────────────────

/**
 * Returns the plan limits for a given org plan.
 * Platform admins get enterprise-level limits.
 */
export function getOrgLimits(orgPlan: OrgPlan, isPlatformAdmin = false): OrgPlanLimits {
  if (isPlatformAdmin) return ORG_PLAN_LIMITS.enterprise;
  return ORG_PLAN_LIMITS[orgPlan] ?? ORG_PLAN_LIMITS.free;
}

/**
 * Returns the maximum number of active members for an org plan.
 * -1 means unlimited.
 */
export function getOrgMemberLimit(orgPlan: OrgPlan, isPlatformAdmin = false): number {
  return getOrgLimits(orgPlan, isPlatformAdmin).maxMembers;
}

/**
 * Returns the maximum number of staff seats (coaches + admins) for an org plan.
 * -1 means unlimited.
 */
export function getOrgStaffLimit(orgPlan: OrgPlan, isPlatformAdmin = false): number {
  return getOrgLimits(orgPlan, isPlatformAdmin).maxStaffSeats;
}

/**
 * Checks whether an org plan has access to a specific B2B feature.
 * Platform admins always have access.
 */
export function canOrgAccessFeature(orgPlan: OrgPlan, feature: string, isPlatformAdmin = false): boolean {
  if (isPlatformAdmin) return true;
  const allowed = ORG_FEATURE_GATES[feature];
  if (!allowed) return true; // Feature not gated
  return allowed.includes(orgPlan);
}

/**
 * Returns true if the given member/staff count is within the plan limit.
 * -1 (unlimited) always returns true.
 */
export function isWithinOrgLimit(count: number, limit: number): boolean {
  return limit === -1 || count < limit;
}
