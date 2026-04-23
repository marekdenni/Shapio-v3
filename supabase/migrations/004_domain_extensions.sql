-- Domain extensions: explicit data ownership, programs, platform admin
-- Additive migration — all new columns are nullable, no data loss.

-- ─── Explicit ownership: org_id on content tables ────────────────────────────
-- Plans and photos can optionally belong to an org context. NULL = personal/B2C.
-- This enables: coaches assigning plans to members, org-scoped analytics,
-- and future multi-tenant reporting without changing existing queries.

DO $$
BEGIN
  -- workout_plans.org_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workout_plans' AND column_name = 'org_id'
  ) THEN
    ALTER TABLE workout_plans ADD COLUMN org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
  END IF;

  -- nutrition_plans.org_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'nutrition_plans' AND column_name = 'org_id'
  ) THEN
    ALTER TABLE nutrition_plans ADD COLUMN org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
  END IF;

  -- progress_photos.org_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'progress_photos' AND column_name = 'org_id'
  ) THEN
    ALTER TABLE progress_photos ADD COLUMN org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
  END IF;

  -- ai_coach_messages.org_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_coach_messages' AND column_name = 'org_id'
  ) THEN
    ALTER TABLE ai_coach_messages ADD COLUMN org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Indexes for org-scoped content queries
CREATE INDEX IF NOT EXISTS idx_workout_plans_org_id ON workout_plans(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_nutrition_plans_org_id ON nutrition_plans(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_progress_photos_org_id ON progress_photos(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_coach_messages_org_id ON ai_coach_messages(org_id) WHERE org_id IS NOT NULL;

-- ─── Platform admin flag ─────────────────────────────────────────────────────
-- Simple boolean on user_profiles. Distinguishes Shapio platform operators
-- from regular users and org admins. Checked in future admin routes.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'is_platform_admin'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN is_platform_admin BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
END $$;

-- ─── Programs ────────────────────────────────────────────────────────────────
-- A structured transformation journey, challenge, or plan owned by an org
-- or by the platform. Programs are containers that enroll users into
-- a shared experience with shared configuration.

CREATE TYPE program_type AS ENUM ('transformation', 'challenge', 'course', 'plan', 'other');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'paused', 'dropped');

CREATE TABLE programs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID REFERENCES organizations(id) ON DELETE CASCADE,  -- NULL = platform-owned
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL,
  description     TEXT,
  type            program_type NOT NULL DEFAULT 'transformation',
  duration_days   INTEGER,
  settings        JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (org_id, slug)
);

CREATE TABLE program_enrollments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id      UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  status          enrollment_status NOT NULL DEFAULT 'active',
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (program_id, user_id)
);

-- Indexes
CREATE INDEX idx_programs_org_id ON programs(org_id);
CREATE INDEX idx_programs_slug ON programs(slug);
CREATE INDEX idx_programs_is_active ON programs(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_program_enrollments_program_id ON program_enrollments(program_id);
CREATE INDEX idx_program_enrollments_user_id ON program_enrollments(user_id);
CREATE INDEX idx_program_enrollments_status ON program_enrollments(status);

-- ─── RLS for Programs ───────────────────────────────────────────────────────

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_enrollments ENABLE ROW LEVEL SECURITY;

-- Programs: readable by org members (for org-owned) or all authenticated (for platform-owned)
CREATE POLICY "Users can view programs they have access to"
  ON programs FOR SELECT
  USING (
    -- Platform-owned programs are visible to all authenticated users
    (org_id IS NULL AND auth.uid() IS NOT NULL)
    OR
    -- Org-owned programs are visible to org members
    org_id IN (
      SELECT m.org_id FROM org_memberships m
      WHERE m.user_id = auth.uid() AND m.status = 'active'
    )
  );

-- Programs: manageable by org owner/admin or platform admin
CREATE POLICY "Org admin can manage programs"
  ON programs FOR INSERT
  WITH CHECK (
    (org_id IS NULL AND EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_platform_admin = TRUE
    ))
    OR
    org_id IN (
      SELECT m.org_id FROM org_memberships m
      WHERE m.user_id = auth.uid() AND m.role IN ('owner', 'admin') AND m.status = 'active'
    )
  );

CREATE POLICY "Org admin can update programs"
  ON programs FOR UPDATE
  USING (
    (org_id IS NULL AND EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_platform_admin = TRUE
    ))
    OR
    org_id IN (
      SELECT m.org_id FROM org_memberships m
      WHERE m.user_id = auth.uid() AND m.role IN ('owner', 'admin') AND m.status = 'active'
    )
  );

-- Enrollments: users can see their own, admins/coaches can see org enrollments
CREATE POLICY "Users can view own enrollments"
  ON program_enrollments FOR SELECT
  USING (
    user_id = auth.uid()
    OR
    program_id IN (
      SELECT p.id FROM programs p
      JOIN org_memberships m ON m.org_id = p.org_id
      WHERE m.user_id = auth.uid() AND m.role IN ('owner', 'admin', 'coach') AND m.status = 'active'
    )
  );

CREATE POLICY "Admin/coach can enroll users"
  ON program_enrollments FOR INSERT
  WITH CHECK (
    -- Self-enrollment
    user_id = auth.uid()
    OR
    -- Admin/coach enrolling a member
    program_id IN (
      SELECT p.id FROM programs p
      JOIN org_memberships m ON m.org_id = p.org_id
      WHERE m.user_id = auth.uid() AND m.role IN ('owner', 'admin', 'coach') AND m.status = 'active'
    )
  );

CREATE POLICY "Enrollment status can be updated"
  ON program_enrollments FOR UPDATE
  USING (
    user_id = auth.uid()
    OR
    program_id IN (
      SELECT p.id FROM programs p
      JOIN org_memberships m ON m.org_id = p.org_id
      WHERE m.user_id = auth.uid() AND m.role IN ('owner', 'admin', 'coach') AND m.status = 'active'
    )
  );

-- ─── Triggers ────────────────────────────────────────────────────────────────

CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Extend existing content RLS for org-scoped access ──────────────────────
-- Coaches and admins in an org can view workout/nutrition plans of their members.
-- These policies SUPPLEMENT (not replace) existing user-only policies.

CREATE POLICY "Org coaches can view member workout plans"
  ON workout_plans FOR SELECT
  USING (
    org_id IS NOT NULL
    AND org_id IN (
      SELECT m.org_id FROM org_memberships m
      WHERE m.user_id = auth.uid() AND m.role IN ('owner', 'admin', 'coach') AND m.status = 'active'
    )
  );

CREATE POLICY "Org coaches can view member nutrition plans"
  ON nutrition_plans FOR SELECT
  USING (
    org_id IS NOT NULL
    AND org_id IN (
      SELECT m.org_id FROM org_memberships m
      WHERE m.user_id = auth.uid() AND m.role IN ('owner', 'admin', 'coach') AND m.status = 'active'
    )
  );
