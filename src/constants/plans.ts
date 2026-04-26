// getbeter plan definitions and feature gate configuration
import type { SubscriptionTier, PlanDetails } from '@/types';

export const PLANS: Record<SubscriptionTier, PlanDetails> = {
  free: {
    name: 'Free',
    price: 0,
    priceLabel: 'Zdarma',
    duration: 30,
    tagline: 'Začni hned — bez platební karty',
    trackFit: 'Skvělý start pro každý cíl a úroveň',
    features: [
      'Osobní AI analýza tvého profilu',
      '30denní startovní tréninkový plán',
      'Výběr transformační cesty',
      'Dashboard a sledování pokroku',
    ],
    limitations: [
      'Bez výživového plánu s makry',
      'Bez adaptivního plánování',
      'Bez AI kouče',
    ],
  },
  starter: {
    name: 'Starter',
    price: 149,
    priceLabel: '149 Kč/měs',
    duration: 60,
    tagline: 'Kompletní základ pro trvalou transformaci',
    trackFit: 'Ideální pro začátečníky a střední pokročilé',
    features: [
      '60denní personalizovaný transformační plán',
      'Výživa s makry, kaloriemi a denním trackingem',
      'Fotogalerie pokroku před/po',
      'Týdenní check-in a adjustace plánu',
      'E-mailová podpora',
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
    tagline: 'Kompletní AI transformace bez kompromisů',
    trackFit: 'Pro vážné výsledky — tělo, výživa i kouč na jednom místě',
    features: [
      '90denní adaptivní transformační plán',
      'AI kouč 24/7 — 10 zpráv denně',
      'Výživa s makry, recepty a týdenním plánem',
      'Plán se přizpůsobuje tvojím výsledkům',
      'Pokročilá analýza pokroku každý týden',
      'Porovnání fotek před/po s AI komentářem',
      'Prioritní podpora',
    ],
  },
  elite: {
    name: 'Elite',
    price: 1499,
    priceLabel: '1 499 Kč/měs',
    duration: 180,
    tagline: 'Maximální výsledky — 6 měsíců bez kompromisů',
    trackFit: 'Pro ty, kdo to myslí vážně a chtějí maximum',
    features: [
      '180denní transformační plán na půl roku',
      'AI kouč bez omezení — 50 zpráv denně',
      'Plně adaptivní trénink i výživa',
      'Detailní analýza a reporting každý týden',
      'Porovnání fotek + AI hodnocení pokroku',
      'Prioritní podpora s garantovanou odezvou',
      'Brzy: skupinové výzvy a komunita',
      'Brzy: firemní wellness a týmový přístup',
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
 */
export function getFeatureMinTier(feature: string): SubscriptionTier | null {
  const allowed = FEATURE_GATES[feature];
  if (!allowed || allowed.length === 0) return null;
  for (const t of TIER_ORDER) {
    if (allowed.includes(t)) return t;
  }
  return null;
}
