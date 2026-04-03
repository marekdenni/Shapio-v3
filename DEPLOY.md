# Shapio Deployment Guide

## Local Development

```bash
cp .env.example .env.local
# Fill in all env vars in .env.local
npm install
npm run dev
```

App runs at http://localhost:3000

---

## Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Enable Google auth in **Authentication → Providers → Google**
   - Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com)
   - Add Client ID and Client Secret in Supabase
4. Add redirect URLs in **Authentication → URL Configuration**:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs:
     - `https://yourdomain.com/auth/callback`
     - `http://localhost:3000/auth/callback`
5. Copy Project URL and anon key to `.env.local`

---

## Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Create 3 recurring subscription products in CZK:
   - **Shapio Starter**: 149 CZK/month (recurring)
   - **Shapio Pro**: 349 CZK/month (recurring)
   - **Shapio Elite**: 1499 CZK/month (recurring — NOTE: was one-time, now monthly)
3. Copy price IDs to `.env.local`:
   ```
   STRIPE_PRICE_STARTER_MONTHLY=price_xxx
   STRIPE_PRICE_PRO_MONTHLY=price_xxx
   STRIPE_PRICE_ELITE_MONTHLY=price_xxx
   ```
4. Set up webhook for **local development**:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   # Copy the webhook secret (whsec_...) to .env.local as STRIPE_WEBHOOK_SECRET
   ```
5. Set up webhook for **production**:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
     - `invoice.payment_succeeded`
   - Copy Signing Secret to Vercel env vars as `STRIPE_WEBHOOK_SECRET`

---

## Vercel Deployment

1. Push your code to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables in **Vercel → Project Settings → Environment Variables**:
   - All variables from `.env.example`
   - Set `NEXT_PUBLIC_APP_URL` to your production domain
4. Deploy — Vercel auto-detects Next.js framework

---

## Custom Domain

1. Add domain in **Vercel → Settings → Domains**
2. Update DNS records as shown in Vercel dashboard
3. Update env var: `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
4. Update Supabase:
   - Site URL → `https://yourdomain.com`
   - Redirect URLs → add `https://yourdomain.com/auth/callback`
5. Update Stripe webhook endpoint URL to `https://yourdomain.com/api/stripe/webhook`

---

## Production Checklist

- [ ] All env vars set in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` points to production domain
- [ ] Supabase redirect URLs updated
- [ ] Google OAuth redirect URIs updated
- [ ] Stripe webhook endpoint configured for production
- [ ] Stripe using live keys (pk_live_, sk_live_)
- [ ] Database migration run in Supabase
- [ ] Test auth flow (email + Google)
- [ ] Test Stripe checkout and webhook
- [ ] Test AI plan generation
