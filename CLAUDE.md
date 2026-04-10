# Shapio project context

## Product focus
Shapio is a fitness app/web project focused on:
- auth reliability
- onboarding completion
- free user account access
- conversion-focused UX

## Current priorities
1. Fix Google login
2. Fix email/password login
3. Fix onboarding loop
4. Let free users access account/dashboard
5. Keep premium gating only for premium features

## Development rules
- Do not refactor unrelated files
- Change only necessary files
- Keep Czech user-facing copy
- Prefer targeted fixes over broad rewrites
- Always inspect auth, session, onboarding and routing together

## Important notes
- If auth works but routing fails, inspect session restore and onboarding-completed checks
- Free plan access must not be confused with onboarding completion
- Users with completed onboarding must go to account/dashboard, not back to onboarding
