// Partner and extension commercial layer.
//
// Defines the typed contract for future partner modules — supplement affiliates,
// grocery/meal kit opportunities, gym finder, coach marketplace, premium content,
// employer wellness, and white-label delivery.
//
// NOTHING HERE SHIPS UI TODAY. This is infrastructure:
//   - Types define what a partner module looks like.
//   - PARTNER_MODULES is the central registry (currently empty).
//   - Helper functions let UI slots query the registry cleanly.
//
// When a real partner is onboarded, add one PartnerModule entry here (or load
// from DB) and wire the relevant UI slot — no scattered inline checks needed.

import type { SubscriptionTier, OrgPlan } from '@/types';

// ─── Slot types ──────────────────────────────────────────────────────────────
// Each slot maps to a concrete placement in the product surface.

export type PartnerSlot =
  | 'supplement_recommendation' // Post-analysis: protein/vitamin affiliate offer
  | 'grocery_opportunity'       // Nutrition plan: meal kit or supermarket tie-in
  | 'gym_recommendation'        // Onboarding/plan: location-based gym finder
  | 'coach_marketplace'         // Post-free: certified coach upgrade path
  | 'premium_content'           // Dashboard/plan: paid challenge or program unlock
  | 'employer_wellness'         // B2B: corporate wellness module extension
  | 'branded_program';          // B2B: white-label program delivery slot

// ─── Partner module definition ───────────────────────────────────────────────

export interface PartnerModule {
  /** Unique stable identifier for this partner integration. */
  id: string;
  /** Which product surface slot this module occupies. */
  slot: PartnerSlot;
  /** Whether this module is active. Inactive modules are never returned. */
  enabled: boolean;
  /**
   * Minimum personal subscription tier required to see this module.
   * Undefined = visible to all tiers including free.
   */
  minUserTier?: SubscriptionTier;
  /**
   * Org feature key required for this module to show in an org context.
   * Undefined = no org feature requirement (shows in personal context too).
   */
  orgFeatureGate?: string;
  /**
   * Minimum org plan required for this module in B2B context.
   * Undefined = available on all org plans.
   */
  minOrgPlan?: OrgPlan;
}

// ─── Registry ────────────────────────────────────────────────────────────────
// Add entries here as partners are onboarded. Future: load from DB/remote config.

export const PARTNER_MODULES: PartnerModule[] = [
  // Example (disabled until partner is onboarded):
  // {
  //   id: 'myprotein_affiliate',
  //   slot: 'supplement_recommendation',
  //   enabled: false,
  //   minUserTier: 'starter',
  // },
];

// ─── Query helpers ────────────────────────────────────────────────────────────

/**
 * Returns all active modules registered for a given slot.
 * Pass userTier to filter by minimum tier requirement.
 */
export function getModulesForSlot(
  slot: PartnerSlot,
  userTier?: SubscriptionTier
): PartnerModule[] {
  const TIER_LEVEL: Record<SubscriptionTier, number> = {
    free: 0, starter: 1, pro: 2, elite: 3,
  };

  return PARTNER_MODULES.filter((m) => {
    if (!m.enabled || m.slot !== slot) return false;
    if (m.minUserTier && userTier) {
      return TIER_LEVEL[userTier] >= TIER_LEVEL[m.minUserTier];
    }
    return true;
  });
}

/**
 * Returns true if any active partner module exists for the given slot.
 * Use this for conditional UI rendering (avoids rendering empty containers).
 */
export function hasModuleForSlot(slot: PartnerSlot, userTier?: SubscriptionTier): boolean {
  return getModulesForSlot(slot, userTier).length > 0;
}
