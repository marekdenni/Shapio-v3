import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateWorkoutPlan, generateNutritionPlan, generateAssessmentSummary, generateFreeWelcomeAnalysis } from '@/lib/openai';
import type { UserProfile } from '@/types';
import type { OnboardingContext } from '@/lib/openai';

// POST /api/onboarding/generate-plan
// Generates AI workout and nutrition plans for authenticated users.
// Each AI call is wrapped individually — a single failure returns a fallback
// and never prevents onboarding from completing.
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
    const { profile, onboardingContext } = body as {
      profile: Partial<UserProfile>;
      onboardingContext?: OnboardingContext;
    };

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
    const profileWithTier = { ...profile, subscriptionTier: tier };

    // Run all AI calls in parallel; each has its own fallback so one failure
    // does not block the others or crash the response.
    const [workoutPlanData, nutritionPlanData, assessmentSummary, freeWelcomeAnalysis] =
      await Promise.all([
        generateWorkoutPlan(profileWithTier, tier, onboardingContext).catch((err) => {
          console.error('[route] generateWorkoutPlan threw unexpectedly:', err);
          return { tier, durationDays: 30, weeks: [], assessmentSummary: '', focusAreas: [] };
        }),
        generateNutritionPlan(profileWithTier, tier, onboardingContext).catch((err) => {
          console.error('[route] generateNutritionPlan threw unexpectedly:', err);
          return { tier, dailyTargets: { calories: 2000, proteinG: 150, carbsG: 200, fatG: 60 }, meals: [], hydrationLiters: 2.5, generalGuidelines: [], supplementSuggestions: [] };
        }),
        generateAssessmentSummary(profileWithTier, onboardingContext).catch((err) => {
          console.error('[route] generateAssessmentSummary threw unexpectedly:', err);
          return 'Tvůj plán je připraven. Začínáme transformaci.';
        }),
        generateFreeWelcomeAnalysis(profileWithTier, onboardingContext).catch((err) => {
          console.error('[route] generateFreeWelcomeAnalysis threw unexpectedly:', err);
          return null;
        }),
      ]);

    // Save workout plan to Supabase.
    // assessment_summary stores the structured free welcome analysis as JSON,
    // with the plain text assessment embedded for backwards compat.
    const assessmentSummaryPayload = JSON.stringify({
      text: assessmentSummary,
      freeAnalysis: freeWelcomeAnalysis,
    });

    const { data: savedWorkoutPlan, error: workoutError } = await supabase
      .from('workout_plans')
      .insert({
        user_id: user.id,
        tier,
        duration_days: workoutPlanData.durationDays,
        plan_data: workoutPlanData.weeks,
        assessment_summary: assessmentSummaryPayload,
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

    // Always mark onboarding completed — even if AI generation partially failed.
    // This matches the client-side guard in loading-analysis/page.tsx and
    // prevents the dashboard → /onboarding redirect loop.
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
      freeWelcomeAnalysis,
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při generování plánu. Zkus to prosím znovu.' },
      { status: 500 }
    );
  }
}
