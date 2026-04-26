import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyPlatformAdmin } from '@/lib/admin-auth';

export async function GET() {
  const caller = await verifyPlatformAdmin();
  if (!caller) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const adminClient = createAdminClient();
  const { data: users, error } = await adminClient
    .from('user_profiles')
    .select(
      'id, name, email, age, sex, goal, fitness_level, equipment, ' +
      'workout_days_per_week, dietary_preference, subscription_tier, ' +
      'onboarding_completed, is_platform_admin, target_motivation, ' +
      'activity_level, session_duration_minutes, main_frictions, ' +
      'interest_signals, selected_track, ' +
      'created_at, updated_at'
    )
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

  return NextResponse.json({ users: users ?? [] });
}
