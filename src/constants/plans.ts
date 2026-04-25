// getbeter plan definitions and feature gate configuration
import type { SubscriptionTier, PlanDetails } from '@/types';

export const PLANS: Record<SubscriptionTier, PlanDetails> = {
  free: {
    name: 'Free',
    price: 0,
    priceLabel: 'Zdarma',
    duration: 30,
    tagline: 'Vyzkoušej bez závazků',
    trackFit: 'Základní start pro každý cíl',
    features: [
      '30denní startovní plán',
      'Základní tréninkový plán',
      'AI analýza profilu (1×)',
      'Přístup k aplikaci',
    ],
    limitations: [
      'Bez maker a kalorií',
      'Bez adaptivního plánování',
      'Bez AI kouče',
      'Bez pokročilé analýzy',
    ],
  },
  starter: {
    name: 'Starter',
    price: 149,
    priceLabel: '149 Kč/měs',
    duration: 60,
    tagline: 'Kompletní základ pro transformaci',
    trackFit: 'Ideální pro začátečníky a středně pokročilé',
    features: [
      '60denní transformační plán',
      'Kompletní tréninkový plán',
      'Makra a kalorický plán',
      'Týdenní check-in',
      'Fotogalerie pokroku',
      'Přístup k aplikaci',
    ],
    limitations: [
      'Bez AI kouče',
      'Bez adaptivního plánování',
    ],
  },
  pro: {
    name: 'Pro',
    price: 349,
    priceLabel: '349 Kč/měs',
    duration: 90,
    isPopular: true,
    tagline: 'Kompletní transformace s AI',
    trackFit: 'Pro vážné výsledky — tělo i vzhled',
    features: [
      '90denní transformační plán',
      'Adaptivní plán dle pokroku',
      'Detailní výživový plán s makry',
      'AI kouč (10 zpráv/den)',
      'Porovnání fotek před/po',
      'Pokročilá analýza pokroku',
      'Týdenní check-in',
      'Prioritní podpora',
    ],
  },
  elite: {
    name: 'Elite',
    price: 1499,
    priceLabel: '1 499 Kč/měs',
    duration: 180,
    tagline: 'Maximální výsledky bez kompromisů',
    trackFit: 'Pro ty, kdo to myslí vážně',
    features: [
      '180denní transformační plán',
      'Plně adaptivní trénink',
      'Komplexní výživový plán',
      'AI kouč bez omezení (50 zpráv/den)',
      'Prioritní porovnání fotek',
      'Detailní analýza každý týden',
      'Přístup k budoucím prémiovým funkcím',
    ],
  },
};

// Feature gates - which tiers have access to which features
export const FEATURE_GATES: Record<string, SubscriptionTier[]> = {
  nutrition_macros: ['starter', 'pro', 'elite'],
  ai_coach: ['pro', 'elite'],
  progress_comparison: ['pro', 'elite'],
  adaptive_plan: ['pro', 'elite'],
  plan_60_days: ['starter', 'pro', 'elite'],
  plan_90_days: ['pro', 'elite'],
  plan_180_days: ['elite'],
  detailed_analysis: ['pro', 'elite'],
  weekly_checkin: ['starter', 'pro', 'elite'],
  progress_ai_feedback: ['pro', 'elite'],
};

/**
 * Checks if a given tier has access to a feature.
 */
export function canAccessFeature(
  tier: SubscriptionTier,
  feature: string
): boolean {
  const allowedTiers = FEATURE_GATES[feature];
  if (!allowedTiers) return true; // Feature not gated
  return allowedTiers.includes(tier);
}

// Tier order for min-tier lookups
const TIER_ORDER: SubscriptionTier[] = ['starter', 'pro', 'elite'];

/**
 * Returns the lowest tier that unlocks a given feature, or null if ungated.
 * Useful for generating informative lock overlay descriptions.
 */
export function getFeatureMinTier(feature: string): SubscriptionTier | null {
  const allowed = FEATURE_GATES[feature];
  if (!allowed || allowed.length === 0) return null;
  for (const t of TIER_ORDER) {
    if (allowed.includes(t)) return t;
  }
  return null;
}
