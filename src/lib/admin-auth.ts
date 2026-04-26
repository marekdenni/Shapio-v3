import { createServerClient, createAdminClient } from '@/lib/supabase/server';

/**
 * Verifies the calling user is a platform admin.
 *
 * Two-layer check:
 * 1. Primary: is_platform_admin = true in user_profiles (DB flag, set manually)
 * 2. Fallback: ADMIN_EMAIL_ALLOWLIST env var — comma-separated emails that are
 *    treated as admins even without the DB flag. Useful for bootstrapping before
 *    the DB flag has been set on the owner's account.
 *
 * Returns the verified userId on success, null on failure.
 * All data fetched with the admin client — bypasses RLS.
 */
export async function verifyPlatformAdmin(): Promise<{ userId: string; email: string } | null> {
  const serverClient = createServerClient();
  const { data: { user } } = await serverClient.auth.getUser();
  if (!user?.id || !user.email) return null;

  // Check env allowlist first — zero DB queries if the email matches
  const allowlist = process.env.ADMIN_EMAIL_ALLOWLIST ?? '';
  if (allowlist) {
    const allowed = allowlist.split(',').map((e) => e.trim().toLowerCase());
    if (allowed.includes(user.email.toLowerCase())) {
      return { userId: user.id, email: user.email };
    }
  }

  // Fall back to DB flag
  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from('user_profiles')
    .select('is_platform_admin')
    .eq('id', user.id)
    .single();

  if (!data?.is_platform_admin) return null;
  return { userId: user.id, email: user.email };
}
