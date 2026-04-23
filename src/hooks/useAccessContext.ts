'use client';

// Unified access context hook — resolves the user's effective permissions
// by combining personal subscription tier, organization plan, platform
// admin status, and org role into a single, consistent context.
//
// This replaces ad-hoc permission checks scattered across components with
// a single hook that can be used everywhere. It also provides the
// EntitlementContext needed by the entitlements module.

import { useAuthStore } from '@/stores/auth';
import { useOrgStore } from '@/stores/organization';
import { useSubscriptionStore } from '@/stores/subscription';
import { resolveEffectiveTier, canAccess, hasPaidAccess, hasProAccess } from '@/lib/entitlements';
import type { SubscriptionTier, OrgRole, OrgPlan } from '@/types';
import type { EntitlementContext } from '@/lib/entitlements';

// ─── Resolved access levels ─────────────────────────────────────────────────

export type PlatformRole = 'platform_admin' | 'user';

export interface AccessContext {
  // Identity
  userId: string | null;
  isAuthenticated: boolean;

  // Platform-level role
  platformRole: PlatformRole;
  isPlatformAdmin: boolean;

  // Personal subscription
  personalTier: SubscriptionTier;

  // Organization context (null if not in org scope)
  orgId: string | null;
  orgRole: OrgRole | null;
  orgPlan: OrgPlan | null;

  // Effective (resolved) access — union of personal + org
  effectiveTier: SubscriptionTier;

  // Convenience feature checks
  canAccess: (feature: string) => boolean;
  hasPaidAccess: boolean;
  hasProAccess: boolean;

  // Org-level permission checks (null-safe)
  canManageMembers: boolean;
  canEditOrg: boolean;
  canViewAnalytics: boolean;

  // The raw entitlement context (for passing to lib/entitlements functions)
  entitlementContext: EntitlementContext;

  // Loading state
  loading: boolean;
}

/**
 * Returns the user's full access context by combining:
 * - Platform admin flag from user_profiles.is_platform_admin
 * - Personal subscription_tier from user_profiles
 * - Org plan from organizations (if in org context)
 * - Org role from org_memberships (if in org context)
 *
 * The effective tier is the higher of personal tier and org plan,
 * with platform admins getting full ('elite') access everywhere.
 */
export function useAccessContext(): AccessContext {
  const { user, profile, loading: authLoading } = useAuthStore();
  const { currentOrg, membership, loading: orgLoading } = useOrgStore();
  const { tier: subTier, loading: subLoading } = useSubscriptionStore();

  const userId = user?.id ?? null;
  const isAuthenticated = !!user;
  const isPlatformAdmin = profile?.isPlatformAdmin ?? false;
  const platformRole: PlatformRole = isPlatformAdmin ? 'platform_admin' : 'user';

  const personalTier = profile?.subscriptionTier ?? subTier ?? 'free';
  const orgId = currentOrg?.id ?? null;
  const orgRole = membership?.role ?? null;
  const orgPlan = currentOrg?.plan ?? null;

  const entitlementContext: EntitlementContext = {
    userTier: personalTier,
    orgPlan,
    isPlatformAdmin,
  };

  const effectiveTier = resolveEffectiveTier(entitlementContext);
  const loading = authLoading || orgLoading || subLoading;

  // Role hierarchy helpers (duplicated from org store for standalone use)
  const ROLE_LEVELS: Record<OrgRole, number> = {
    owner: 4,
    admin: 3,
    coach: 2,
    member: 1,
  };

  const hasRoleLevel = (required: OrgRole): boolean => {
    if (!orgRole) return false;
    return ROLE_LEVELS[orgRole] >= ROLE_LEVELS[required];
  };

  return {
    userId,
    isAuthenticated,
    platformRole,
    isPlatformAdmin,
    personalTier,
    orgId,
    orgRole,
    orgPlan,
    effectiveTier,
    canAccess: (feature: string) => canAccess(entitlementContext, feature),
    hasPaidAccess: hasPaidAccess(entitlementContext),
    hasProAccess: hasProAccess(entitlementContext),
    canManageMembers: hasRoleLevel('admin'),
    canEditOrg: hasRoleLevel('admin'),
    canViewAnalytics: hasRoleLevel('coach'),
    entitlementContext,
    loading,
  };
}
