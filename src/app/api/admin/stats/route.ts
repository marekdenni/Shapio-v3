import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyPlatformAdmin } from '@/lib/admin-auth';

export async function GET() {
  const caller = await verifyPlatformAdmin();
  if (!caller) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const adminClient = createAdminClient();

  const { data: profiles, error } = await adminClient
    .from('user_profiles')
    .select('id, subscription_tier, onboarding_completed, goal, selected_track, created_at');

  if (error || !profiles) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }

  const total = profiles.length;
  const byTier: Record<string, number> = { free: 0, starter: 0, pro: 0, elite: 0 };
  const byGoal: Record<string, number> = {};
  const byTrack: Record<string, number> = {};
  let onboardingCompleted = 0;
  let recentSignups = 0;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  for (const p of profiles) {
    const tier = p.subscription_tier as string;
    byTier[tier] = (byTier[tier] ?? 0) + 1;
    if (p.onboarding_completed) onboardingCompleted++;
    if (p.goal) byGoal[p.goal] = (byGoal[p.goal] ?? 0) + 1;
    if (p.selected_track) byTrack[p.selected_track] = (byTrack[p.selected_track] ?? 0) + 1;
    if (p.created_at >= sevenDaysAgo) recentSignups++;
  }

  const paidUsers = (byTier.starter ?? 0) + (byTier.pro ?? 0) + (byTier.elite ?? 0);

  return NextResponse.json({
    total,
    byTier,
    byGoal,
    byTrack,
    onboardingCompleted,
    onboardingRate: total > 0 ? Math.round((onboardingCompleted / total) * 100) : 0,
    recentSignups,
    paidUsers,
  });
}
