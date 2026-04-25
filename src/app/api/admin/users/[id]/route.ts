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

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const isAdmin = await verifyPlatformAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = params;
  const adminClient = createAdminClient();

  const { data: profile, error } = await adminClient
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Parallel counts — best-effort, don't fail if tables don't exist yet
  const [workoutResult, nutritionResult, photoResult, messageResult] = await Promise.all([
    adminClient.from('workout_plans').select('*', { count: 'exact', head: true }).eq('user_id', id),
    adminClient.from('nutrition_plans').select('*', { count: 'exact', head: true }).eq('user_id', id),
    adminClient.from('progress_photos').select('*', { count: 'exact', head: true }).eq('user_id', id),
    adminClient.from('ai_coach_messages').select('*', { count: 'exact', head: true }).eq('user_id', id),
  ]);

  return NextResponse.json({
    profile,
    activity: {
      workoutPlans:    workoutResult.count   ?? 0,
      nutritionPlans:  nutritionResult.count ?? 0,
      progressPhotos:  photoResult.count     ?? 0,
      aiMessages:      messageResult.count   ?? 0,
    },
  });
}
