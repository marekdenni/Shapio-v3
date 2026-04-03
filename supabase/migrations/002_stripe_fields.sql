-- Add Stripe fields to user_profiles if they don't exist
-- (These may already be present from migration 001, this is idempotent)

DO $$
BEGIN
  -- Add stripe_customer_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN stripe_customer_id TEXT UNIQUE;
  END IF;

  -- Add stripe_subscription_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN stripe_subscription_id TEXT;
  END IF;

  -- Add subscription_tier if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN subscription_tier subscription_tier DEFAULT 'free';
  END IF;
END $$;

-- Index for fast Stripe customer lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer_id
  ON user_profiles(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- Index for subscription tier queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier
  ON user_profiles(subscription_tier);
