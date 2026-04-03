import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createBillingPortalSession } from '@/lib/stripe';

// POST /api/stripe/billing-portal
// Creates a Stripe Billing Portal session for subscription management
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Nejsi přihlášen.' }, { status: 401 });
    }

    // Get Stripe customer ID
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Nemáš aktivní předplatné.' },
        { status: 400 }
      );
    }

    // Create billing portal session
    const session = await createBillingPortalSession(profile.stripe_customer_id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Billing portal error:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při přístupu k portálu předplatného.' },
      { status: 500 }
    );
  }
}
