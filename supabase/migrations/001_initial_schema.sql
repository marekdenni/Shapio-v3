-- Initial Shapio database schema
-- Enable required extensions

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Custom Enum Types ───────────────────────────────────────────────────────

CREATE TYPE subscription_tier AS ENUM ('free', 'starter', 'pro', 'elite');
CREATE TYPE fitness_goal AS ENUM ('fat_loss', 'muscle_gain', 'recomposition', 'general_fitness');
CREATE TYPE fitness_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE equipment_type AS ENUM ('none', 'home_basic', 'gym_full');
CREATE TYPE dietary_preference AS ENUM ('no_preference', 'vegetarian', 'vegan', 'keto', 'low_carb');
CREATE TYPE sex_type AS ENUM ('male', 'female');

-- ─── Tables ──────────────────────────────────────────────────────────────────

-- User profiles table - extends auth.users
CREATE TABLE user_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT,
  email           TEXT,
  age             INTEGER CHECK (age >= 13 AND age <= 100),
  sex             sex_type,
  height_cm       INTEGER CHECK (height_cm >= 100 AND height_cm <= 250),
  weight_kg       NUMERIC(5,1) CHECK (weight_kg >= 30 AND weight_kg <= 300),
  fitness_level   fitness_level,
  goal            fitness_goal,
  equipment       equipment_type,
  workout_days_per_week INTEGER CHECK (workout_days_per_week >= 1 AND workout_days_per_week <= 7),
  dietary_preference dietary_preference DEFAULT 'no_preference',
  injuries        TEXT,
  target_motivation TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  subscription_tier subscription_tier DEFAULT 'free',
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Workout plans table
CREATE TABLE workout_plans (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  tier            subscription_tier NOT NULL DEFAULT 'free',
  duration_days   INTEGER NOT NULL DEFAULT 30,
  plan_data       JSONB NOT NULL DEFAULT '[]'::jsonb,
  assessment_summary TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Nutrition plans table
CREATE TABLE nutrition_plans (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  tier            subscription_tier NOT NULL DEFAULT 'free',
  plan_data       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Progress photos table
CREATE TABLE progress_photos (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  photo_url       TEXT NOT NULL,
  notes           TEXT,
  week_number     INTEGER,
  uploaded_at     TIMESTAMPTZ DEFAULT NOW()
);

-- AI coach messages table
CREATE TABLE ai_coach_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- AI daily usage tracking table
CREATE TABLE ai_daily_usage (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  message_count   INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX idx_workout_plans_user_id ON workout_plans(user_id);
CREATE INDEX idx_workout_plans_created_at ON workout_plans(created_at DESC);
CREATE INDEX idx_nutrition_plans_user_id ON nutrition_plans(user_id);
CREATE INDEX idx_progress_photos_user_id ON progress_photos(user_id);
CREATE INDEX idx_progress_photos_uploaded_at ON progress_photos(uploaded_at DESC);
CREATE INDEX idx_ai_coach_messages_user_id ON ai_coach_messages(user_id);
CREATE INDEX idx_ai_coach_messages_created_at ON ai_coach_messages(created_at);
CREATE INDEX idx_ai_daily_usage_user_date ON ai_daily_usage(user_id, date);

-- ─── Row Level Security (RLS) ─────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_coach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_daily_usage ENABLE ROW LEVEL SECURITY;

-- user_profiles policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- workout_plans policies
CREATE POLICY "Users can view own workout plans"
  ON workout_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout plans"
  ON workout_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- nutrition_plans policies
CREATE POLICY "Users can view own nutrition plans"
  ON nutrition_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition plans"
  ON nutrition_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- progress_photos policies
CREATE POLICY "Users can view own progress photos"
  ON progress_photos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress photos"
  ON progress_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress photos"
  ON progress_photos FOR DELETE
  USING (auth.uid() = user_id);

-- ai_coach_messages policies
CREATE POLICY "Users can view own coach messages"
  ON ai_coach_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coach messages"
  ON ai_coach_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ai_daily_usage policies
CREATE POLICY "Users can view own usage"
  ON ai_daily_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own usage"
  ON ai_daily_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON ai_daily_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- ─── Storage Bucket ───────────────────────────────────────────────────────────

-- Create storage bucket for progress photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', true)
ON CONFLICT DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Users can upload own progress photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'progress-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own progress photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'progress-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own progress photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'progress-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Public read access for progress photos (so img src URLs work)
CREATE POLICY "Public can view progress photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'progress-photos');

-- ─── Triggers ─────────────────────────────────────────────────────────────────

-- Function: auto-create user_profile when a new auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger fires after new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function: auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
