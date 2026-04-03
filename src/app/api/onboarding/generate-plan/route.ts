import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateWorkoutPlan, generateNutritionPlan, generateAssessmentSummary } from '@/lib/openai';
import type { UserProfile } from '@/types';

// POST /api/onboarding/generate-plan
// Generates AI workout and nutrition plans for authenticated users
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Nejsi přihlášen.' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { profile } = body as { profile: Partial<UserProfile> };

    if (!profile) {
      return NextResponse.json({ error: 'Profil je povinný.' }, { status: 400 });
    }

    // Get user's subscription tier
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const tier = userProfile?.subscription_tier || 'free';

    // Generate plans in parallel using OpenAI
    const [workoutPlanData, nutritionPlanData, assessmentSummary] = await Promise.all([
      generateWorkoutPlan({ ...profile, subscriptionTier: tier }, tier),
      generateNutritionPlan({ ...profile, subscriptionTier: tier }, tier),
      generateAssessmentSummary({ ...profile, subscriptionTier: tier }),
    ]);

    // Save workout plan to Supabase
    const { data: savedWorkoutPlan, error: workoutError } = await supabase
      .from('workout_plans')
      .insert({
        user_id: user.id,
        tier,
        duration_days: workoutPlanData.durationDays,
        plan_data: workoutPlanData.weeks,
        assessment_summary: assessmentSummary,
      })
      .select()
      .single();

    if (workoutError) {
      console.error('Error saving workout plan:', workoutError);
    }

    // Save nutrition plan to Supabase
    const { data: savedNutritionPlan, error: nutritionError } = await supabase
      .from('nutrition_plans')
      .insert({
        user_id: user.id,
        tier,
        plan_data: {
          dailyTargets: nutritionPlanData.dailyTargets,
          meals: nutritionPlanData.meals,
          hydrationLiters: nutritionPlanData.hydrationLiters,
          generalGuidelines: nutritionPlanData.generalGuidelines,
          supplementSuggestions: nutritionPlanData.supplementSuggestions,
        },
      })
      .select()
      .single();

    if (nutritionError) {
      console.error('Error saving nutrition plan:', nutritionError);
    }

    // Mark onboarding as completed
    await supabase
      .from('user_profiles')
      .update({ onboarding_completed: true })
      .eq('id', user.id);

    return NextResponse.json({
      workoutPlan: {
        ...workoutPlanData,
        id: savedWorkoutPlan?.id,
      },
      nutritionPlan: {
        ...nutritionPlanData,
        id: savedNutritionPlan?.id,
      },
      assessmentSummary,
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při generování plánu. Zkus to prosím znovu.' },
      { status: 500 }
    );
  }
}
