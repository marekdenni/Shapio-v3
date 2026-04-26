import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyPlatformAdmin } from '@/lib/admin-auth';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const caller = await verifyPlatformAdmin();
  if (!caller) {
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

  // Parallel counts + latest assessment — best-effort
  const [workoutResult, nutritionResult, photoResult, messageResult, latestPlanResult] =
    await Promise.all([
      adminClient.from('workout_plans').select('*', { count: 'exact', head: true }).eq('user_id', id),
      adminClient.from('nutrition_plans').select('*', { count: 'exact', head: true }).eq('user_id', id),
      adminClient.from('progress_photos').select('*', { count: 'exact', head: true }).eq('user_id', id),
      adminClient.from('ai_coach_messages').select('*', { count: 'exact', head: true }).eq('user_id', id),
      adminClient
        .from('workout_plans')
        .select('assessment_summary, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
    ]);

  // assessment_summary is stored as JSON: { text, freeAnalysis }
  let latestAssessment: { text: string; freeAnalysis: unknown } | null = null;
  if (latestPlanResult.data?.assessment_summary) {
    try {
      latestAssessment = JSON.parse(latestPlanResult.data.assessment_summary as string);
    } catch {
      latestAssessment = { text: latestPlanResult.data.assessment_summary as string, freeAnalysis: null };
    }
  }

  return NextResponse.json({
    profile,
    activity: {
      workoutPlans:    workoutResult.count   ?? 0,
      nutritionPlans:  nutritionResult.count ?? 0,
      progressPhotos:  photoResult.count     ?? 0,
      aiMessages:      messageResult.count   ?? 0,
    },
    latestAssessment,
  });
}
