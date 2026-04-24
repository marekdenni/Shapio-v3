// OpenAI client and server-side AI generation functions
import OpenAI from 'openai';
import type { UserProfile, SubscriptionTier, WorkoutPlan, NutritionPlan } from '@/types';

export interface OnboardingContext {
  activityLevel?: string | null;
  sessionDurationMinutes?: number | null;
  mainFrictions?: string[];
  interestSignals?: string[];
}

// Initialize OpenAI client — requires OPENAI_API_KEY in environment.
// TODO: set OPENAI_API_KEY in .env.local (dev) and Netlify environment variables (prod).
// The dummy key prevents a build-time crash on import; runtime guards below handle missing keys safely.
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key-to-bypass-build',
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

// ─── Shared label maps used across AI prompts ────────────────────────────────

const GOAL_LABELS: Record<string, string> = {
  fat_loss: 'spalování tuku a zhubnutí',
  muscle_gain: 'budování svalů a nabírání hmoty',
  recomposition: 'rekompozici těla (svaly a tuk zároveň)',
  general_fitness: 'zlepšení celkové kondice',
  improve_discipline: 'budování konzistentní rutiny a zdravých návyků',
  improve_appearance: 'zlepšení vzhledu a sebevědomí v těle',
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'začátečník (0–1 rok tréninku)',
  intermediate: 'středně pokročilý (1–3 roky)',
  advanced: 'pokročilý (3+ let)',
};

const EQUIPMENT_LABELS: Record<string, string> = {
  none: 'bez vybavení (cvičení s vlastní vahou)',
  home_basic: 'domácí vybavení (základní náčiní)',
  gym_full: 'plně vybavená posilovna',
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'sedavý (kancelář, minimum pohybu)',
  lightly_active: 'lehce aktivní (pravidelná chůze)',
  moderately_active: 'středně aktivní (sport 2–3×/týden)',
  very_active: 'velmi aktivní (sport denně nebo fyzická práce)',
};

const FRICTION_LABELS: Record<string, string> = {
  no_time: 'nedostatek času',
  no_motivation: 'nedostatek motivace',
  no_energy: 'nedostatek energie',
  dont_know_what_to_do: 'neví přesně, co dělat',
  injury_fear: 'strach ze zranění',
  past_failures: 'předchozí neúspěchy',
  social_anxiety: 'sociální úzkost v posilovně',
  bad_diet_habits: 'špatné stravovací návyky',
};

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
  tier: SubscriptionTier,
  context?: OnboardingContext
): Promise<Partial<WorkoutPlan>> {
  const durationDays = getDurationForTier(tier);
  const weeks = Math.ceil(durationDays / 7);
  const model = getModelForTier(tier);

  const fallback: Partial<WorkoutPlan> = { tier, durationDays, weeks: [], assessmentSummary: '', focusAreas: [] };

  if (!process.env.OPENAI_API_KEY) {
    return fallback;
  }

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
- Daily Activity Level: ${context?.activityLevel || 'moderately_active'}
- Preferred Session Duration: ${context?.sessionDurationMinutes || 60} minutes
- Known Blockers (address these): ${context?.mainFrictions?.join(', ') || 'none'}

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

  try {
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
  } catch (err) {
    console.error('[openai] generateWorkoutPlan failed:', err);
    return fallback;
  }
}

/**
 * Generates a personalized nutrition plan based on user profile and subscription tier.
 */
export async function generateNutritionPlan(
  profile: Partial<UserProfile>,
  tier: SubscriptionTier,
  context?: OnboardingContext
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

  const activityMultiplierMap: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };
  const activityMultiplier = context?.activityLevel
    ? (activityMultiplierMap[context.activityLevel] ?? 1.375)
    : (profile.workoutDaysPerWeek || 3) >= 5 ? 1.55 : 1.375;
  const tdee = Math.round(bmr * activityMultiplier);

  const fallback: Partial<NutritionPlan> = {
    tier,
    dailyTargets: { calories: tdee, proteinG: 150, carbsG: 200, fatG: 60 },
    meals: [],
    hydrationLiters: 2.5,
    generalGuidelines: [],
    supplementSuggestions: [],
  };

  if (!process.env.OPENAI_API_KEY) {
    return fallback;
  }

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
- Daily Activity Level: ${context?.activityLevel || 'moderately_active'}
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

  try {
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
      dailyTargets: response.dailyTargets || fallback.dailyTargets,
      meals: response.meals || [],
      hydrationLiters: response.hydrationLiters || 2.5,
      generalGuidelines: response.generalGuidelines || [],
      supplementSuggestions: response.supplementSuggestions || [],
    };
  } catch (err) {
    console.error('[openai] generateNutritionPlan failed:', err);
    return fallback;
  }
}

/**
 * Generates an assessment summary for the results page after onboarding.
 */
export async function generateAssessmentSummary(
  profile: Partial<UserProfile>,
  context?: OnboardingContext
): Promise<string> {
  const fallback = 'Tvůj plán je připraven. Začínáme transformaci.';

  if (!process.env.OPENAI_API_KEY) {
    return fallback;
  }

  const assessmentGoalLabel = GOAL_LABELS[profile.goal || 'general_fitness'] ?? 'transformaci těla';
  const assessmentLevelLabel = LEVEL_LABELS[profile.fitnessLevel || 'beginner'] ?? 'začátečník';

  const prompt = `
You are a fitness assessment specialist.
${WELLNESS_DISCLAIMER}

Write a personalized 3-4 sentence assessment in Czech for this user:
- Goal: ${assessmentGoalLabel}
- Age: ${profile.age}
- Sex: ${profile.sex === 'female' ? 'female' : 'male'}
- Weight: ${profile.weightKg} kg / Height: ${profile.heightCm} cm
- Fitness Level: ${assessmentLevelLabel}
- Equipment: ${EQUIPMENT_LABELS[profile.equipment || 'gym_full']}
- Activity Level: ${context?.activityLevel ? ACTIVITY_LABELS[context.activityLevel] ?? context.activityLevel : 'not specified'}
- Known Blockers: ${context?.mainFrictions?.map((f) => FRICTION_LABELS[f] ?? f).join(', ') || 'none'}

Be specific to their profile — mention their goal, level, and one key strength or opportunity.
Do not start with "Based on". Avoid generic filler. Write in Czech.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    return completion.choices[0].message.content || fallback;
  } catch (err) {
    console.error('[openai] generateAssessmentSummary failed:', err);
    return fallback;
  }
}

/**
 * Structured analysis shown on the results page after onboarding.
 * Free tier gets the full shape — premium teaser points toward upgrade.
 * All fields are required; fallback values ensure no empty renders.
 */
export interface FreeWelcomeAnalysis {
  greeting: string;
  startingPoint: string;
  mainBottleneck: string;
  focusArea: string;
  trainingDirection: string;
  nutritionDirection: string;
  habitFocus: string;
  nextStep: string;
  motivationalCta: string;
  premiumTeaser: string;
}

export async function generateFreeWelcomeAnalysis(
  profile: Partial<UserProfile>,
  context?: OnboardingContext
): Promise<FreeWelcomeAnalysis> {
  const goalLabel = GOAL_LABELS[profile.goal || 'general_fitness'] ?? 'transformaci těla';
  const levelLabel = LEVEL_LABELS[profile.fitnessLevel || 'beginner'] ?? 'začátečník';
  const equipmentLabel = EQUIPMENT_LABELS[profile.equipment || 'gym_full'] ?? 'posilovna';
  const activityLabel = context?.activityLevel
    ? (ACTIVITY_LABELS[context.activityLevel] ?? context.activityLevel)
    : 'neuvedeno';
  const frictionLabels = context?.mainFrictions
    ?.map((f) => FRICTION_LABELS[f] ?? f)
    .join(', ') || null;
  const sessionMin = context?.sessionDurationMinutes ?? null;

  const fallback: FreeWelcomeAnalysis = {
    greeting: 'Tvůj profil je připraven — začínáme.',
    startingPoint: `Jsi ${levelLabel} s cílem ${goalLabel}. Máš k dispozici ${equipmentLabel} a chceš cvičit ${profile.workoutDaysPerWeek || 3}× týdně${sessionMin ? ` po ${sessionMin} minutách` : ''}. To je realistický základ, se kterým se dá pracovat.`,
    mainBottleneck: frictionLabels
      ? `Označil jsi jako překážku: ${frictionLabels}. To jsou reálné bariéry — plán je navržen tak, aby s nimi počítal od prvního týdne.`
      : `Pro ${levelLabel} na úrovni jako tvá je největší překážka obvykle konzistence v prvních 3–4 týdnech, než se trénink stane rutinou.`,
    focusArea: `S cílem ${goalLabel} je klíčová oblast ${profile.goal === 'fat_loss' ? 'kalorický deficit + udržení svalů' : profile.goal === 'muscle_gain' ? 'progresivní přetížení + dostatečný kalorický příjem' : 'kombinace silového základu a metabolické adaptace'}.`,
    trainingDirection: `Pro ${equipmentLabel} a ${profile.workoutDaysPerWeek || 3} tréninky týdně doporučujeme strukturu full-body nebo push/pull/legs${sessionMin ? `, vždy ${sessionMin} minut` : ''}. Progresivní přetížení — přidání váhy nebo opakování každý týden — je základní princip.`,
    nutritionDirection: `Pro cíl ${goalLabel} je priorita ${profile.goal === 'fat_loss' ? 'mírný kalorický deficit (–300 až –500 kcal/den) s vysokým příjmem bílkovin' : profile.goal === 'muscle_gain' ? 'mírný kalorický přebytek (+200 až +400 kcal/den) s důrazem na bílkoviny' : 'příjem bílkovin min. 1,6–2 g/kg tělesné hmotnosti'}. ${profile.dietaryPreference && profile.dietaryPreference !== 'no_preference' ? `Stravovací preference (${profile.dietaryPreference}) je zohledněna.` : ''}`,
    habitFocus: `Prvních 7 dní: každý večer si nachystej věci na trénink den dopředu. Eliminuješ tím rozhodovací bariéru ráno — jeden z nejúčinnějších triků pro konzistenci.`,
    nextStep: `Naplánuj si první trénink na konkrétní čas v kalendáři. Ne "dnes nebo zítra" — konkrétní den a hodina. Studie ukazují, že plánování zvyšuje dokončení o 40 %.`,
    motivationalCta: 'Plán máš. Teď záleží jen na jednom kroku — prvním tréninku.',
    premiumTeaser: `S PRO plánem dostaneš přesný týdenní rozvrh, makra přizpůsobená tvé váze, a AI kouče, který ti odpoví na každou otázku — kdykoli.`,
  };

  if (!process.env.OPENAI_API_KEY) {
    return fallback;
  }

  const prompt = `Jsi osobní fitness kouč getbeter. Uživatel dokončil vstupní dotazník. Vytvoř mu strukturovanou, konkrétní a věcnou analýzu.

PRAVIDLA:
- Každá sekce musí být specifická pro tohoto konkrétního uživatele — žádná generická klišé
- Vycházej přímo z dat profilu (věk, váha, úroveň, vybavení, denní aktivita, překážky)
- Délka každé sekce: 2–3 věty max
- Neposkytuj lékařské diagnózy ani léčebná doporučení
- Tón: přímý, věcný, grounded — ne rádoby motivační prázdné fráze

PROFIL UŽIVATELE:
- Pohlaví: ${profile.sex === 'female' ? 'žena' : 'muž'}
- Věk: ${profile.age || 25} let
- Výška / váha: ${profile.heightCm || 175} cm / ${profile.weightKg || 80} kg
- Cíl: ${goalLabel}
- Tréninková úroveň: ${levelLabel}
- Vybavení: ${equipmentLabel}
- Denní aktivita: ${activityLabel}
- Počet tréninků/týden: ${profile.workoutDaysPerWeek || 3}
- Délka tréninku: ${sessionMin ? `${sessionMin} minut` : 'neuvedeno'}
- Stravovací preference: ${profile.dietaryPreference || 'bez omezení'}
- Co ho v minulosti brzdilo: ${frictionLabels || 'neuvedeno'}
- Co ho zajímá: ${context?.interestSignals?.join(', ') || 'neuvedeno'}
- Motivace (vlastními slovy): ${profile.targetMotivation || 'neuvedeno'}
- Zranění / omezení: ${profile.injuries || 'žádná'}

Vrať POUZE JSON v přesně tomto formátu (žádný markdown, žádné obalující znaky):
{
  "greeting": "1 věta, osobní, přímá — zmiň jeho cíl nebo situaci, ne jméno",
  "startingPoint": "Shrnutí výchozího stavu — úroveň, vybavení, cíl, kapacita tréninku — konkrétní čísla z profilu",
  "mainBottleneck": "Největší překážka nebo rizikový bod — vycházej z jeho bariér, úrovně a cíle — buď konkrétní, ne obecný",
  "focusArea": "Primární příležitost — co mu může přinést největší výsledek nejrychleji, specifické pro jeho profil",
  "trainingDirection": "Konkrétní tréninkový přístup — styl, frekvence, délka, zaměření — bez odhalení detailního plánu",
  "nutritionDirection": "Konkrétní výživový přístup — pro jeho cíl a stravovací preference — bez přesných maker (to je premium)",
  "habitFocus": "1 konkrétní návyk pro první týden — realistický, implementovatelný hned, specifický",
  "nextStep": "1 konkrétní akce na dnes nebo zítra — ne vágní rada, ale přesný krok",
  "motivationalCta": "Závěrečná věta — stručná, grounded, specifická pro jeho situaci — ne motivační poster",
  "premiumTeaser": "1 věta o tom, co PRO plán přidá navíc — specifické a hodnotné, ne generický upgrade pitch"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Jsi fitness kouč. Odpovídej pouze platným JSON objektem. Nikdy neposkytuj lékařské rady ani diagnózy.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 900,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw) as Partial<FreeWelcomeAnalysis>;

    const required: (keyof FreeWelcomeAnalysis)[] = [
      'greeting', 'startingPoint', 'mainBottleneck', 'focusArea',
      'trainingDirection', 'nutritionDirection', 'habitFocus',
      'nextStep', 'motivationalCta', 'premiumTeaser',
    ];
    const allPresent = required.every((k) => typeof parsed[k] === 'string' && parsed[k]!.length > 0);

    return allPresent ? (parsed as FreeWelcomeAnalysis) : fallback;
  } catch (err) {
    console.error('[openai] generateFreeWelcomeAnalysis failed:', err);
    return fallback;
  }
}

/**
 * Generates AI progress feedback based on uploaded photos (for PRO/ELITE only).
 */
export async function generateProgressFeedback(
  photos: string[],
  profile: Partial<UserProfile>
): Promise<string> {
  const fallback = 'Skvělá práce! Pokračuj v tomto tempu.';

  if (!process.env.OPENAI_API_KEY) {
    return fallback;
  }

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

  try {
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

    return completion.choices[0].message.content || fallback;
  } catch (err) {
    console.error('[openai] generateProgressFeedback failed:', err);
    return fallback;
  }
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
