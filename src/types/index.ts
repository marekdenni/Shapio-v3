// Core application types for getbeter

// ─── Enums / Union Types ───────────────────────────────────────────────────

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'elite';

export type FitnessGoal =
  | 'fat_loss'
  | 'muscle_gain'
  | 'recomposition'
  | 'general_fitness'
  | 'improve_discipline'
  | 'improve_appearance';

export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';

export type FrictionPattern =
  | 'no_time'
  | 'no_motivation'
  | 'no_energy'
  | 'dont_know_what_to_do'
  | 'injury_fear'
  | 'past_failures'
  | 'social_anxiety'
  | 'bad_diet_habits';

export type InterestSignal =
  | 'ai_coaching'
  | 'progress_tracking'
  | 'nutrition_planning'
  | 'community'
  | 'challenges'
  | 'team_coaching'
  | 'corporate_wellness';

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

// ─── Organization / B2B ────────────────────────────────────────────────────

export type OrgType = 'gym' | 'coach' | 'brand' | 'employer' | 'program' | 'other';
export type OrgPlan = 'free' | 'starter' | 'pro' | 'enterprise';
export type OrgRole = 'owner' | 'admin' | 'coach' | 'member';
export type MembershipStatus = 'active' | 'invited' | 'suspended';

export type OrgBusinessGoal =
  | 'member_retention'
  | 'premium_upsell'
  | 'operational_leverage'
  | 'personalization_at_scale'
  | 'content_delivery'
  | 'other';

// Typed workspace configuration stored in organizations.settings (JSONB).
// All fields are optional for backwards compatibility with existing {} rows.
export interface OrgSettings {
  businessGoal?: OrgBusinessGoal;
  targetAudience?: string;         // free text: who are the end users
  featureInterests?: string[];     // e.g. ['ai_coaching', 'progress_tracking']
  brandingColor?: string;          // hex, for future white-label
  setupCompleted?: boolean;        // true once owner has finished setup wizard
  trialEndsAt?: string;            // ISO date string if on trial
}

// ─── Program / Experience ──────────────────────────────────────────────────

export type ProgramType = 'transformation' | 'challenge' | 'course' | 'plan' | 'other';
export type EnrollmentStatus = 'active' | 'completed' | 'paused' | 'dropped';


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
  activeOrgId?: string;
  isPlatformAdmin: boolean;
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
  orgId?: string;  // nullable — null = personal/B2C, set = org-scoped
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
  orgId?: string;  // nullable — null = personal/B2C, set = org-scoped
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
  orgId?: string;  // nullable — null = personal/B2C, set = org-scoped
  photoUrl: string;
  notes?: string;
  uploadedAt: string;
  weekNumber?: number;
}

// ─── AI Coach ─────────────────────────────────────────────────────────────

export interface AICoachMessage {
  id: string;
  userId: string;
  orgId?: string;  // nullable — null = personal/B2C, set = org-scoped
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
  activityLevel: ActivityLevel | null;
  sessionDurationMinutes: number | null;
  // Step 4: Preferences
  dietaryPreference: DietaryPreference | null;
  injuries: string;
  targetMotivation: string;
  mainFrictions: FrictionPattern[];
  interestSignals: InterestSignal[];
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
  active_org_id: string | null;
  is_platform_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlanRow {
  id: string;
  user_id: string;
  org_id: string | null;
  tier: SubscriptionTier;
  duration_days: number;
  plan_data: WorkoutWeek[];
  assessment_summary: string;
  created_at: string;
}

export interface NutritionPlanRow {
  id: string;
  user_id: string;
  org_id: string | null;
  tier: SubscriptionTier;
  plan_data: object;
  created_at: string;
}

export interface ProgressPhotoRow {
  id: string;
  user_id: string;
  org_id: string | null;
  photo_url: string;
  notes: string | null;
  uploaded_at: string;
  week_number: number | null;
}

export interface AICoachMessageRow {
  id: string;
  user_id: string;
  org_id: string | null;
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

// ─── Organization Types ────────────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: OrgType;
  logoUrl?: string;
  plan: OrgPlan;
  settings: OrgSettings;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrgMembership {
  id: string;
  orgId: string;
  userId: string;
  role: OrgRole;
  status: MembershipStatus;
  invitedEmail?: string;
  invitedAt?: string;
  joinedAt?: string;
  createdAt: string;
}

export interface OrgInvite {
  id: string;
  orgId: string;
  email: string;
  role: OrgRole;
  token: string;
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
}

// ─── Organization DB Row Types (snake_case) ────────────────────────────────

export interface OrganizationRow {
  id: string;
  name: string;
  slug: string;
  type: OrgType;
  logo_url: string | null;
  plan: OrgPlan;
  settings: OrgSettings;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrgMembershipRow {
  id: string;
  org_id: string;
  user_id: string;
  role: OrgRole;
  status: MembershipStatus;
  invited_email: string | null;
  invited_at: string | null;
  joined_at: string | null;
  created_at: string;
}

export interface OrgInviteRow {
  id: string;
  org_id: string;
  email: string;
  role: OrgRole;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

// ─── Program Types ─────────────────────────────────────────────────────────

export interface Program {
  id: string;
  orgId?: string;  // null = platform-owned
  name: string;
  slug: string;
  description?: string;
  type: ProgramType;
  durationDays?: number;
  settings: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramEnrollment {
  id: string;
  programId: string;
  userId: string;
  status: EnrollmentStatus;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

// ─── Program DB Row Types (snake_case) ─────────────────────────────────────

export interface ProgramRow {
  id: string;
  org_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  type: ProgramType;
  duration_days: number | null;
  settings: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramEnrollmentRow {
  id: string;
  program_id: string;
  user_id: string;
  status: EnrollmentStatus;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}
