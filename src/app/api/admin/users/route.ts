import { NextResponse } from 'next/server';
import { createServerClient, createAdminClient } from '@/lib/supabase/server';

async function verifyPlatformAdmin(): Promise<boolean> {
  const serverClient = createServerClient();
  const { data: { user } } = await serverClient.auth.getUser();
  if (!user) return false;

  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from('user_profiles')
    .select('is_platform_admin')
    .eq('id', user.id)
    .single();

  return data?.is_platform_admin === true;
}

export async function GET() {
  const isAdmin = await verifyPlatformAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const adminClient = createAdminClient();
  const { data: users, error } = await adminClient
    .from('user_profiles')
    .select(
      'id, name, email, age, sex, goal, fitness_level, equipment, ' +
      'workout_days_per_week, dietary_preference, subscription_tier, ' +
      'onboarding_completed, is_platform_admin, target_motivation, ' +
      'created_at, updated_at'
    )
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

  return NextResponse.json({ users: users ?? [] });
}
