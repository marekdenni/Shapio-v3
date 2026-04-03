// Core application types for Shapio fitness app

// ─── Enums / Union Types ───────────────────────────────────────────────────

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'elite';

export type FitnessGoal =
  | 'fat_loss'
  | 'muscle_gain'
  | 'recomposition'
  | 'general_fitness';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type Equipment = 'none' | 'home_basic' | 'gym_full';

export type DietaryPreference =
  | 'no_preference'
  | 'vegetarian'
  | 'vegan'
  | 'keto'
  | 'low_carb';

export type Sex = 'male' | 'female';

export type AIMessageRole = 'user' | 'assistant' | 'system';

// ─── User / Profile ────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  fitnessLevel: FitnessLevel;
  goal: FitnessGoal;
  equipment: Equipment;
  workoutDaysPerWeek: number;
  dietaryPreference: DietaryPreference;
  injuries?: string;
  targetMotivation?: string;
  onboardingCompleted: boolean;
  subscriptionTier: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Workout Plan ──────────────────────────────────────────────────────────

export interface Exercise {
  name: string;
  sets: number;
  reps: string; // e.g. "8-12" or "to failure"
  rest: string; // e.g. "60s" or "90s"
  notes?: string;
  muscleGroup?: string;
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string; // e.g. "Pondělí", "Úterý"
  isRestDay: boolean;
  workoutType?: string; // e.g. "Upper Body", "Lower Body", "Full Body"
  durationMinutes?: number;
  exercises: Exercise[];
  warmup?: string;
  cooldown?: string;
}

export interface WorkoutWeek {
  weekNumber: number;
  theme?: string; // e.g. "Adaptation", "Progressive Overload"
  days: WorkoutDay[];
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  durationDays: number;
  weeks: WorkoutWeek[];
  assessmentSummary: string;
  focusAreas: string[];
  createdAt: string;
}

// ─── Nutrition Plan ────────────────────────────────────────────────────────

export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface Meal {
  name: string; // e.g. "Snídaně", "Oběd"
  time?: string; // e.g. "7:00"
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  foods: string[];
  notes?: string;
}

export interface NutritionPlan {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  dailyTargets: MacroTargets;
  meals: Meal[];
  hydrationLiters: number;
  generalGuidelines: string[];
  supplementSuggestions?: string[];
  createdAt: string;
}

// ─── Progress ─────────────────────────────────────────────────────────────

export interface ProgressPhoto {
  id: string;
  userId: string;
  photoUrl: string;
  notes?: string;
  uploadedAt: string;
  weekNumber?: number;
}

// ─── AI Coach ─────────────────────────────────────────────────────────────

export interface AICoachMessage {
  id: string;
  userId: string;
  role: AIMessageRole;
  content: string;
  createdAt: string;
}

export interface AIDailyUsage {
  userId: string;
  date: string;
  messageCount: number;
}

// ─── Onboarding ───────────────────────────────────────────────────────────

export interface OnboardingData {
  // Step 0: Welcome (no data)
  // Step 1: Photos
  photos: File[];
  photoConsent: boolean;
  // Step 2: Goal + basic info
  goal: FitnessGoal | null;
  sex: Sex | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  // Step 3: Fitness details
  fitnessLevel: FitnessLevel | null;
  equipment: Equipment | null;
  workoutDaysPerWeek: number | null;
  // Step 4: Preferences
  dietaryPreference: DietaryPreference | null;
  injuries: string;
  targetMotivation: string;
}

// ─── Stripe / Subscriptions ────────────────────────────────────────────────

export interface StripeSubscription {
  id: string;
  customerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  priceId: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

export interface PlanDetails {
  name: string;
  price: number;
  priceLabel: string;
  duration: number; // days
  features: string[];
  limitations?: string[];
  isPopular?: boolean;
  isOneTime?: boolean;
}

// ─── Database Row Types (snake_case, matching Supabase schema) ─────────────

export interface UserProfileRow {
  id: string;
  name: string;
  email: string;
  age: number | null;
  sex: Sex | null;
  height_cm: number | null;
  weight_kg: number | null;
  fitness_level: FitnessLevel | null;
  goal: FitnessGoal | null;
  equipment: Equipment | null;
  workout_days_per_week: number | null;
  dietary_preference: DietaryPreference | null;
  injuries: string | null;
  target_motivation: string | null;
  onboarding_completed: boolean;
  subscription_tier: SubscriptionTier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlanRow {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  duration_days: number;
  plan_data: WorkoutWeek[];
  assessment_summary: string;
  created_at: string;
}

export interface NutritionPlanRow {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  plan_data: object;
  created_at: string;
}

export interface ProgressPhotoRow {
  id: string;
  user_id: string;
  photo_url: string;
  notes: string | null;
  uploaded_at: string;
  week_number: number | null;
}

export interface AICoachMessageRow {
  id: string;
  user_id: string;
  role: AIMessageRole;
  content: string;
  created_at: string;
}

export interface AIDailyUsageRow {
  id: string;
  user_id: string;
  date: string;
  message_count: number;
}
