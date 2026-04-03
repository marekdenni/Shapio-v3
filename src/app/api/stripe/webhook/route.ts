import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, getTierFromPriceId } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/server';
import type Stripe from 'stripe';

// POST /api/stripe/webhook
// Handles all incoming Stripe webhook events
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  // Verify webhook signature to ensure request is from Stripe
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {

      // ── User completes checkout → update subscription tier ──────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier;

        if (!userId || !tier) {
          console.error('Missing userId or tier in checkout session metadata');
          break;
        }

        await supabase
          .from('user_profiles')
          .update({
            subscription_tier: tier,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: (session.subscription as string) || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        console.log(`[Stripe] User ${userId} upgraded to ${tier}`);
        break;
      }

      // ── Subscription updated (plan change, renewal, etc.) ────────────────
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const priceId = subscription.items.data[0]?.price.id;
        const tier = priceId ? getTierFromPriceId(priceId) : 'free';

        if (subscription.status === 'active' || subscription.status === 'trialing') {
          await supabase
            .from('user_profiles')
            .update({
              subscription_tier: tier,
              stripe_subscription_id: subscription.id,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', customerId);

          console.log(`[Stripe] Subscription updated for customer ${customerId} → ${tier}`);
        }
        break;
      }

      // ── Subscription canceled or expired → downgrade to free ─────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabase
          .from('user_profiles')
          .update({
            subscription_tier: 'free',
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        console.log(`[Stripe] Subscription canceled for customer ${customerId} → downgraded to free`);
        break;
      }

      // ── Payment failed — log for potential notification/retry logic ───────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn(`[Stripe] Payment failed for customer ${invoice.customer}, invoice ${invoice.id}`);
        // TODO: Optionally send notification email or mark account as payment_failed
        break;
      }

      // ── Invoice paid (renewal success) ───────────────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe] Payment succeeded for customer ${invoice.customer}`);
        break;
      }

      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('[Stripe] Error processing webhook event:', error);
    // Return 200 anyway — Stripe will retry on 5xx, which could create loops
    return NextResponse.json({ received: true, warning: 'Processing error logged' });
  }

  // Always return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}
