# Shapio project context

## Product focus
Shapio is a B2B-first AI-powered transformation platform with B2B2C delivery:
- Organizations (gyms, coaches, brands, employers) are the primary buyers
- End users (members, clients) receive personalized fitness and wellness experiences
- Architecture supports organizational ownership, workspaces, and member delivery

## Core priorities
1. Auth reliability (email, Google, password reset)
2. Onboarding completion without loops
3. Free user account access to dashboard
4. Premium gating only for premium features
5. Organization creation and member management
6. Role-based access (owner, admin, coach, member)

## Development rules
- Do not refactor unrelated files
- Change only necessary files
- Keep Czech user-facing copy
- Prefer targeted fixes over broad rewrites
- Always inspect auth, session, onboarding and routing together
- Organization features are additive — never break existing B2C flows
- One user identity across all orgs (user_profiles is the single source)
- active_org_id = null means personal/B2C mode

## Architecture notes
- Organizations table: id, name, slug, type, plan, settings
- Org memberships: org_id + user_id + role + status
- Org invites: token-based with 7-day expiry
- Org routes: /org/create, /org/[slug], /org/[slug]/members, /org/[slug]/settings
- Org API: /api/org/create, /api/org/[slug]/invite

## Important notes
- If auth works but routing fails, inspect session restore and onboarding-completed checks
- Free plan access must not be confused with onboarding completion
- Users with completed onboarding must go to account/dashboard, not back to onboarding
- Org features must never interfere with the personal dashboard flow
