import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createCheckoutSession, STRIPE_PRICE_IDS } from '@/lib/stripe';
import type { SubscriptionTier } from '@/types';

// POST /api/stripe/create-checkout
// Creates a Stripe Checkout session and returns the redirect URL
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Nejsi přihlášen.' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { tier } = body as { tier: SubscriptionTier };

    if (!tier || tier === 'free') {
      return NextResponse.json({ error: 'Neplatný plán.' }, { status: 400 });
    }

    // Get price ID for the selected tier
    const priceId = STRIPE_PRICE_IDS[tier];
    if (!priceId) {
      return NextResponse.json(
        { error: 'Cenový plán není nakonfigurován. Kontaktujte podporu.' },
        { status: 500 }
      );
    }

    // Get user email and existing Stripe customer ID
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email, stripe_customer_id')
      .eq('id', user.id)
      .single();

    const customerEmail = profile?.email || user.email || undefined;
    const existingCustomerId = profile?.stripe_customer_id || null;

    // Create Stripe checkout session with proper success/cancel URLs
    const session = await createCheckoutSession(
      user.id,
      priceId,
      tier,
      customerEmail,
      existingCustomerId
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při vytváření platby. Zkus to prosím znovu.' },
      { status: 500 }
    );
  }
}
