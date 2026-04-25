// B2B operator analytics helpers.
// All functions accept a Supabase client so they work from both API routes
// (createServerClient) and client components (createClientComponentClient).
// Returns honest numbers from real DB queries — no synthetic data.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = any;

// ─── Org engagement ───────────────────────────────────────────────────────────

export interface OrgEngagementSummary {
  totalMembers: number;
  onboardingCompleted: number;
  analysisCompleted: number;
  newMembersLast30Days: number;
  onboardingRate: number;   // 0–1, NaN when 0 members
  activationRate: number;   // 0–1, NaN when 0 members
}

export async function getOrgEngagementSummary(
  supabase: AnySupabaseClient,
  orgId: string
): Promise<OrgEngagementSummary> {
  const empty: OrgEngagementSummary = {
    totalMembers: 0,
    onboardingCompleted: 0,
    analysisCompleted: 0,
    newMembersLast30Days: 0,
    onboardingRate: 0,
    activationRate: 0,
  };

  try {
    // Fetch all active member user_ids for this org
    const { data: memberships, error: memErr } = await supabase
      .from('org_memberships')
      .select('user_id, joined_at')
      .eq('org_id', orgId)
      .eq('status', 'active');

    if (memErr || !memberships?.length) return empty;

    const userIds: string[] = memberships.map((m: { user_id: string }) => m.user_id);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const newMembersLast30Days = memberships.filter(
      (m: { joined_at: string | null }) => m.joined_at && m.joined_at >= thirtyDaysAgo
    ).length;

    // Onboarding completion: members who have completed onboarding
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('id, onboarding_completed')
      .in('id', userIds);

    const onboardingCompleted =
      (profiles ?? []).filter((p: { onboarding_completed: boolean }) => p.onboarding_completed).length;

    // Activation: members who have at least one workout plan (= ran the AI analysis)
    const { data: plans } = await supabase
      .from('workout_plans')
      .select('user_id')
      .in('user_id', userIds);

    const usersWithPlan = new Set((plans ?? []).map((p: { user_id: string }) => p.user_id));
    const analysisCompleted = usersWithPlan.size;

    const totalMembers = userIds.length;

    return {
      totalMembers,
      onboardingCompleted,
      analysisCompleted,
      newMembersLast30Days,
      onboardingRate: totalMembers > 0 ? onboardingCompleted / totalMembers : 0,
      activationRate: totalMembers > 0 ? analysisCompleted / totalMembers : 0,
    };
  } catch {
    return empty;
  }
}

// ─── User activation indicators ──────────────────────────────────────────────

export interface UserActivationState {
  hasCompletedOnboarding: boolean;
  hasWorkoutPlan: boolean;
  planCreatedAt: string | null;
  daysSincePlanStart: number | null;
}

export async function getUserActivationState(
  supabase: AnySupabaseClient,
  userId: string
): Promise<UserActivationState> {
  const empty: UserActivationState = {
    hasCompletedOnboarding: false,
    hasWorkoutPlan: false,
    planCreatedAt: null,
    daysSincePlanStart: null,
  };

  try {
    const [{ data: profile }, { data: plan }] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single(),
      supabase
        .from('workout_plans')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
    ]);

    const planCreatedAt = plan?.created_at ?? null;
    let daysSincePlanStart: number | null = null;
    if (planCreatedAt) {
      const start = new Date(planCreatedAt);
      start.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      daysSincePlanStart = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }

    return {
      hasCompletedOnboarding: profile?.onboarding_completed ?? false,
      hasWorkoutPlan: !!plan,
      planCreatedAt,
      daysSincePlanStart,
    };
  } catch {
    return empty;
  }
}
