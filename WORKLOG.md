# WORKLOG

## Current branch
main

## Last known focus
- B2B foundation implementation
- Organization model, membership, invites
- Auth and onboarding previously stabilized (4-layer defense)

## Done
- Created shared Claude workflow files
- Pushed shared setup to GitHub
- Full codebase audit (60+ files inspected)
- Verified auth flow is working (email, Google, password reset)
- Verified onboarding loop fix (4 layers of defense)
- Verified free user dashboard access is correct
- B2B Foundation: database schema (migration 003_b2b_foundation.sql)
  - organizations, org_memberships, org_invites tables
  - org_type, org_plan, org_role, membership_status enums
  - RLS policies for all org tables
  - active_org_id column on user_profiles
- B2B Foundation: type system extensions (types/index.ts)
  - Organization, OrgMembership, OrgInvite interfaces
  - OrganizationRow, OrgMembershipRow, OrgInviteRow DB row types
  - OrgType, OrgPlan, OrgRole, MembershipStatus union types
- B2B Foundation: stores and hooks
  - stores/organization.ts (Zustand store for org context)
  - hooks/useOrganization.ts (facade hook)
- B2B Foundation: auth store extended with activeOrgId mapping
- B2B Foundation: middleware extended with /org route protection
- B2B Foundation: org routes
  - /org/create (organization creation page)
  - /org/[slug] (org dashboard)
  - /org/[slug]/members (member management + invite modal)
  - /org/[slug]/settings (org settings)
- B2B Foundation: API routes
  - POST /api/org/create (org creation + owner membership)
  - POST /api/org/[slug]/invite (member invitation with token)
- Updated CLAUDE.md with B2B context

## Broken / blocked
- Production env vars not configured on Netlify (ops issue)
- Stripe price IDs need to be set
- Invite email sending not implemented (token-based link only)

## Next step
- Implement invite acceptance flow (/invite/[token])
- Add org switcher to Navbar
- Add "Vytvořit organizaci" link from settings page
- Run local build to verify no TS errors in new code
- Deploy migration 003 to Supabase
