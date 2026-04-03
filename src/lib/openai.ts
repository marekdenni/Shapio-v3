// OpenAI client and server-side AI generation functions
import OpenAI from 'openai';
import type { UserProfile, SubscriptionTier, WorkoutPlan, NutritionPlan } from '@/types';

// Initialize OpenAI client
// PŘIDÁNA POJISTKA: Pokud klíč chybí během buildu, použije se dummy text, aby proces nespadl.
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key-to-bypass-netlify-build-error',
});

// AI usage limits per tier per day
export const AI_LIMITS = {
  PRO_DAILY: 10,
  ELITE_DAILY: 50,
  MAX_WORDS: 300,
} as const;

// Wellness / medical disclaimer always included in system prompts
const WELLNESS_DISCLAIMER = `
IMPORTANT: You are a fitness assistant providing general wellness information only.
Always include a brief note that users should consult healthcare professionals before starting any new fitness or nutrition program.
Do not provide medical diagnoses, treatment recommendations, or specific medical advice.
Focus on general fitness and nutrition principles suitable for healthy adults.
`;

/**
 * Returns the appropriate OpenAI model based on subscription tier.
 * Free/Starter users get gpt-4o-mini for cost efficiency.
 * Pro/Elite users get gpt-4o for highest quality responses.
 */
export function getModelForTier(tier: SubscriptionTier): string {
  if (tier === 'pro' || tier === 'elite') {
    return 'gpt-4o';
  }
  return 'gpt-4o-mini';
}

/**
 * Generates a personalized workout plan based on user profile and subscription tier.
 */
export async function generateWorkoutPlan(
  profile: Partial<UserProfile>,
  tier: SubscriptionTier
): Promise<Partial<WorkoutPlan>> {
  const model = getModelForTier(tier);
  const durationDays = getDurationForTier(tier);
  const weeks = Math.ceil(durationDays / 7);

  const prompt = `
You are an expert personal trainer creating a personalized workout plan.
${WELLNESS_DISCLAIMER}

User Profile:
- Goal: ${profile.goal || 'general_fitness'}
- Sex: ${profile.sex || 'male'}
- Age: ${profile.age || 25}
- Height: ${profile.heightCm || 175} cm
- Weight: ${profile.weightKg || 80} kg
- Fitness Level: ${profile.fitnessLevel || 'beginner'}
- Equipment: ${profile.equipment || 'gym_full'}
- Workout Days Per Week: ${profile.workoutDaysPerWeek || 3}
- Dietary Preference: ${profile.dietaryPreference || 'no_preference'}
- Injuries/Limitations: ${profile.injuries || 'none'}
- Motivation: ${profile.targetMotivation || 'general improvement'}

Create a ${durationDays}-day (${weeks}-week) workout plan.
Return a JSON object with this structure:
{
  "assessmentSummary": "2-3 sentence assessment in Czech",
  "focusAreas": ["area1", "area2", "area3"],
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "week theme in Czech",
      "days": [
        {
          "dayNumber": 1,
          "dayName": "Pondělí",
          "isRestDay": false,
          "workoutType": "type in Czech",
          "durationMinutes": 45,
          "warmup": "brief warmup description in Czech",
          "cooldown": "brief cooldown in Czech",
          "exercises": [
            {
              "name": "Exercise name in Czech",
              "sets": 3,
              "reps": "8-12",
              "rest": "60s",
              "muscleGroup": "muscle group in Czech",
              "notes": "technique notes in Czech"
            }
          ]
        }
      ]
    }
  ]
}

Keep the plan realistic and progressive. Include proper rest days.
All text values should be in Czech language.
For free tier, only generate 1-2 weeks of detail. For paid tiers, generate all ${weeks} weeks.
`;

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are an expert personal trainer. Always respond with valid JSON only, no markdown.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: tier === 'elite' ? 4000 : tier === 'pro' ? 3000 : 2000,
    response_format: { type: 'json_object' },
  });

  const response = JSON.parse(completion.choices[0].message.content || '{}');

  return {
    tier,
    durationDays,
    weeks: response.weeks || [],
    assessmentSummary: response.assessmentSummary || '',
    focusAreas: response.focusAreas || [],
  };
}

/**
 * Generates a personalized nutrition plan based on user profile and subscription tier.
 */
export async function generateNutritionPlan(
  profile: Partial<UserProfile>,
  tier: SubscriptionTier
): Promise<Partial<NutritionPlan>> {
  const model = getModelForTier(tier);

  // Calculate approximate TDEE using Mifflin-St Jeor equation
  const weight = profile.weightKg || 80;
  const height = profile.heightCm || 175;
  const age = profile.age || 25;
  const sex = profile.sex || 'male';
  const bmr = sex === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMultiplier = (profile.workoutDaysPerWeek || 3) >= 5 ? 1.55 : 1.375;
  const tdee = Math.round(bmr * activityMultiplier);

  const prompt = `
You are an expert sports nutritionist creating a personalized nutrition plan.
${WELLNESS_DISCLAIMER}

User Profile:
- Goal: ${profile.goal || 'general_fitness'}
- Sex: ${sex}
- Age: ${age}
- Weight: ${weight} kg
- Height: ${height} cm
- Fitness Level: ${profile.fitnessLevel || 'beginner'}
- Workout Days: ${profile.workoutDaysPerWeek || 3}/week
- Dietary Preference: ${profile.dietaryPreference || 'no_preference'}
- Estimated TDEE: ${tdee} kcal

Create a daily nutrition plan. Return JSON:
{
  "dailyTargets": {
    "calories": ${tdee},
    "proteinG": 0,
    "carbsG": 0,
    "fatG": 0
  },
  "hydrationLiters": 2.5,
  "meals": [
    {
      "name": "Snídaně",
      "time": "7:00",
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fat": 0,
      "description": "meal description in Czech",
      "foods": ["food1", "food2"],
      "notes": "optional notes in Czech"
    }
  ],
  "generalGuidelines": ["guideline1 in Czech", "guideline2 in Czech"],
  "supplementSuggestions": ["supplement1 in Czech"]
}

All text in Czech. Adjust macros based on goal:
- fat_loss: caloric deficit 15-20%, high protein
- muscle_gain: caloric surplus 10-15%, high protein
- recomposition: maintenance calories, very high protein
- general_fitness: maintenance calories, balanced macros
`;

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are an expert sports nutritionist. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.6,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const response = JSON.parse(completion.choices[0].message.content || '{}');

  return {
    tier,
    dailyTargets: response.dailyTargets || { calories: tdee, proteinG: 150, carbsG: 200, fatG: 60 },
    meals: response.meals || [],
    hydrationLiters: response.hydrationLiters || 2.5,
    generalGuidelines: response.generalGuidelines || [],
    supplementSuggestions: response.supplementSuggestions || [],
  };
}

/**
 * Generates an assessment summary for the results page after onboarding.
 */
export async function generateAssessmentSummary(
  profile: Partial<UserProfile>
): Promise<string> {
  const model = 'gpt-4o-mini'; // Always use mini for quick assessment

  const prompt = `
You are a fitness assessment specialist.
${WELLNESS_DISCLAIMER}

Based on this user profile, write a personalized 3-4 sentence assessment in Czech:
- Goal: ${profile.goal}
- Age: ${profile.age}
- Sex: ${profile.sex}
- Weight: ${profile.weightKg} kg
- Fitness Level: ${profile.fitnessLevel}
- Equipment: ${profile.equipment}

Be encouraging, specific, and motivating. Mention their specific goal and fitness level.
Write in a direct, masculine tone (the app is targeted at men).
Do not start with "Based on" - be direct and personal.
`;

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.8,
    max_tokens: 300,
  });

  return completion.choices[0].message.content || 'Tvůj plán je připraven. Začínáme transformaci.';
}

/**
 * Generates AI progress feedback based on uploaded photos (for PRO/ELITE only).
 */
export async function generateProgressFeedback(
  photos: string[],
  profile: Partial<UserProfile>
): Promise<string> {
  const model = getModelForTier(profile.subscriptionTier || 'pro');

  const prompt = `
You are a supportive fitness coach reviewing progress.
${WELLNESS_DISCLAIMER}

The user has uploaded ${photos.length} progress photo(s).
User info:
- Goal: ${profile.goal}
- Weeks into program: estimated based on photos
- Starting weight: ${profile.weightKg} kg

Write 2-3 sentences of encouraging, supportive feedback in Czech.
Focus on consistency and effort, avoid commenting on specific body parts.
Be motivating and forward-looking.
`;

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.8,
    max_tokens: 200,
  });

  return completion.choices[0].message.content || 'Skvělá práce! Pokračuj v tomto tempu.';
}

/**
 * Returns the plan duration in days based on subscription tier.
 */
function getDurationForTier(tier: SubscriptionTier): number {
  const durations: Record<SubscriptionTier, number> = {
    free: 30,
    starter: 60,
    pro: 90,
    elite: 180,
  };
  return durations[tier];
}