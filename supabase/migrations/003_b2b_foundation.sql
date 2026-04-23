-- B2B Foundation: Organizations, Memberships, Invites
-- Additive migration — no existing tables are altered except one nullable column on user_profiles.

-- ─── Enum Types ──────────────────────────────────────────────────────────────

CREATE TYPE org_type AS ENUM ('gym', 'coach', 'brand', 'employer', 'program', 'other');
CREATE TYPE org_plan AS ENUM ('free', 'starter', 'pro', 'enterprise');
CREATE TYPE org_role AS ENUM ('owner', 'admin', 'coach', 'member');
CREATE TYPE membership_status AS ENUM ('active', 'invited', 'suspended');

-- ─── Organizations ───────────────────────────────────────────────────────────

CREATE TABLE organizations (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT NOT NULL,
  slug                  TEXT UNIQUE NOT NULL,
  type                  org_type NOT NULL DEFAULT 'other',
  logo_url              TEXT,
  plan                  org_plan NOT NULL DEFAULT 'free',
  settings              JSONB NOT NULL DEFAULT '{}'::jsonb,
  stripe_customer_id    TEXT UNIQUE,
  stripe_subscription_id TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Slug must be URL-safe: lowercase alphanumeric + hyphens, 3-48 chars
ALTER TABLE organizations
  ADD CONSTRAINT organizations_slug_format
  CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,46}[a-z0-9]$');

-- ─── Organization Memberships ────────────────────────────────────────────────

CREATE TABLE org_memberships (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id        UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role          org_role NOT NULL DEFAULT 'member',
  status        membership_status NOT NULL DEFAULT 'active',
  invited_email TEXT,
  invited_at    TIMESTAMPTZ,
  joined_at     TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (org_id, user_id)
);

-- ─── Organization Invites ────────────────────────────────────────────────────

CREATE TABLE org_invites (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  role        org_role NOT NULL DEFAULT 'member',
  token       TEXT UNIQUE NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Extend user_profiles ────────────────────────────────────────────────────
-- Nullable FK: the user's currently-active org context. NULL = personal/B2C mode.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'active_org_id'
  ) THEN
    ALTER TABLE user_profiles
      ADD COLUMN active_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_plan ON organizations(plan);
CREATE INDEX idx_org_memberships_org_id ON org_memberships(org_id);
CREATE INDEX idx_org_memberships_user_id ON org_memberships(user_id);
CREATE INDEX idx_org_memberships_role ON org_memberships(org_id, role);
CREATE INDEX idx_org_invites_org_id ON org_invites(org_id);
CREATE INDEX idx_org_invites_token ON org_invites(token);
CREATE INDEX idx_org_invites_email ON org_invites(email);
CREATE INDEX idx_user_profiles_active_org ON user_profiles(active_org_id) WHERE active_org_id IS NOT NULL;

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_invites ENABLE ROW LEVEL SECURITY;

-- Organizations: readable by members, writable by owner/admin
CREATE POLICY "Org members can view their org"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT org_id FROM org_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Org owner/admin can update org"
  ON organizations FOR UPDATE
  USING (
    id IN (
      SELECT org_id FROM org_memberships
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
    )
  );

-- Anyone authenticated can create an org (they become owner via application logic)
CREATE POLICY "Authenticated users can create orgs"
  ON organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Memberships: viewable by org members, manageable by owner/admin
CREATE POLICY "Org members can view memberships in their org"
  ON org_memberships FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM org_memberships AS m
      WHERE m.user_id = auth.uid() AND m.status = 'active'
    )
  );

CREATE POLICY "Org owner/admin can insert memberships"
  ON org_memberships FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM org_memberships AS m
      WHERE m.user_id = auth.uid() AND m.role IN ('owner', 'admin') AND m.status = 'active'
    )
    -- Also allow self-insert (accepting invite)
    OR user_id = auth.uid()
  );

CREATE POLICY "Org owner/admin can update memberships"
  ON org_memberships FOR UPDATE
  USING (
    org_id IN (
      SELECT org_id FROM org_memberships AS m
      WHERE m.user_id = auth.uid() AND m.role IN ('owner', 'admin') AND m.status = 'active'
    )
  );

CREATE POLICY "Org owner can delete memberships"
  ON org_memberships FOR DELETE
  USING (
    org_id IN (
      SELECT org_id FROM org_memberships AS m
      WHERE m.user_id = auth.uid() AND m.role = 'owner' AND m.status = 'active'
    )
  );

-- Invites: viewable by org admin/owner, token-based lookup for acceptance
CREATE POLICY "Org admin can view invites"
  ON org_invites FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM org_memberships
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
    )
    -- Also allow reading own invite by email (for acceptance flow)
    OR email = (SELECT email FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Org admin can create invites"
  ON org_invites FOR INSERT
  WITH CHECK (
    org_id IN (
      SELECT org_id FROM org_memberships
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
    )
  );

CREATE POLICY "Invite can be updated on acceptance"
  ON org_invites FOR UPDATE
  USING (
    email = (SELECT email FROM user_profiles WHERE id = auth.uid())
    OR org_id IN (
      SELECT org_id FROM org_memberships
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
    )
  );

-- ─── Triggers ────────────────────────────────────────────────────────────────

-- Auto-update updated_at on organizations
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
