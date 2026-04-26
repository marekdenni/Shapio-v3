-- Persist onboarding context fields that were collected but never stored.
-- These are used for AI plan generation and personalization. Without them,
-- re-generating plans or coaching insights loses the user's full context.
-- All columns are nullable to avoid breaking existing rows.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'activity_level'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN activity_level TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'session_duration_minutes'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN session_duration_minutes INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'main_frictions'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN main_frictions JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'interest_signals'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN interest_signals JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'selected_track'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN selected_track TEXT;
  END IF;
END $$;

-- Index for filtering users by activity level (analytics / segmentation)
CREATE INDEX IF NOT EXISTS idx_user_profiles_activity_level
  ON user_profiles(activity_level)
  WHERE activity_level IS NOT NULL;
