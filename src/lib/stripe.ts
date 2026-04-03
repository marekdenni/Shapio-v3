// Stripe server-side client and helper functions
// Required env vars:
//   STRIPE_SECRET_KEY — your Stripe secret key (sk_test_... or sk_live_...)
//   NEXT_PUBLIC_APP_URL — your app URL (http://localhost:3000 or https://yourdomain.com)
//   STRIPE_PRICE_STARTER_MONTHLY — Stripe price ID for Starter (149 CZK/month recurring)
//   STRIPE_PRICE_PRO_MONTHLY — Stripe price ID for Pro (349 CZK/month recurring)
//   STRIPE_PRICE_ELITE_MONTHLY — Stripe price ID for Elite (1499 CZK/month recurring)
//   STRIPE_WEBHOOK_SECRET — from Stripe dashboard or CLI (whsec_...)
import Stripe from 'stripe';
import type { SubscriptionTier, PlanDetails } from '@/types';

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // OPRAVENO: Verze API sladěna s typy knihovny
  typescript: true,
});

// Map plan tiers to Stripe price IDs from environment variables
// ALL plans are now monthly recurring subscriptions
export const STRIPE_PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER_MONTHLY || '',
  pro: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
  elite: process.env.STRIPE_PRICE_ELITE_MONTHLY || '', // Was one-time, now monthly recurring
};

// Complete plan details with pricing in CZK and feature lists
export const PLANS: Record<SubscriptionTier, PlanDetails> = {
  free: {
    name: 'Free',
    price: 0,
    priceLabel: 'Zdarma',
    duration: 30,
    features: [
      '30denní startovní plán',
      'Základní tréninkový plán',
      'Omezené tipy ke stravě',
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
    features: [
      '60denní transformační plán',
      'Kompletní tréninkový plán',
      'Makra a kalorický plán',
      'Týdenní check-in',
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
    features: [
      '90denní transformační plán',
      'Adaptivní tréninkový plán',
      'Detailní výživový plán s makry',
      'AI kouč (10 zpráv/den)',
      'Porovnání před/po fotek',
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
    features: [
      '180denní transformační plán',
      'Plně adaptivní trénink',
      'Komplexní výživový plán',
      'AI kouč bez omezení (50 zpráv/den)',
      'Prioritní porovnání fotek',
      'Detailní analýza každý týden',
      'Doživotní přístup k výsledkům',
    ],
  },
};

/**
 * Gets or creates a Stripe customer for the given user.
 * Creates a new customer if stripeCustomerId is null/undefined.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  existingCustomerId?: string | null
): Promise<string> {
  if (existingCustomerId) {
    return existingCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  return customer.id;
}

/**
 * Creates a Stripe Checkout session for upgrading subscription.
 * All plans use mode: 'subscription' (monthly recurring).
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  tier: SubscriptionTier,
  customerEmail?: string,
  stripeCustomerId?: string | null
): Promise<Stripe.Checkout.Session> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription', // Always subscription — ELITE is now monthly
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/dashboard?success=true`,
    cancel_url: `${appUrl}/paywall`,
    metadata: {
      userId,
      tier,
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  };

  // Use existing customer or set customer email for new customer creation
  if (stripeCustomerId) {
    sessionParams.customer = stripeCustomerId;
  } else if (customerEmail) {
    sessionParams.customer_email = customerEmail;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  return session;
}

/**
 * Creates a Stripe Billing Portal session for managing subscription.
 */
export async function createBillingPortalSession(
  customerId: string
): Promise<Stripe.BillingPortal.Session> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/settings`,
  });

  return session;
}

/**
 * Retrieves the active subscription for a Stripe customer.
 */
export async function getSubscriptionByCustomerId(
  customerId: string
): Promise<Stripe.Subscription | null> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  return subscriptions.data[0] || null;
}

/**
 * Maps a Stripe price ID to a SubscriptionTier.
 */
export function getTierFromPriceId(priceId: string): SubscriptionTier {
  if (priceId === STRIPE_PRICE_IDS.elite) return 'elite';
  if (priceId === STRIPE_PRICE_IDS.pro) return 'pro';
  if (priceId === STRIPE_PRICE_IDS.starter) return 'starter';
  return 'free';
}