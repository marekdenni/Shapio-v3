'use client';

// Auth store — no persist middleware (Supabase manages sessions via cookies/localStorage)
// loading starts true, AuthProvider calls initialize() once on mount to resolve it
import { create } from 'zustand';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';
import { getAppUrl } from '@/lib/config';

const supabase = createClientComponentClient();

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Maps a Supabase `user_profiles` row (snake_case) to the client-side
 * UserProfile interface (camelCase). All optional/nullable fields use
 * nullish coalescing to produce safe defaults. This is the SINGLE source
 * of truth for the DB→client mapping — used by loadProfile for initial
 * fetch, insert fallback, and retry-after-conflict paths.
 */
function mapRowToProfile(row: Record<string, any>): UserProfile {
  return {
    id: row.id,
    name: row.name ?? '',
    email: row.email ?? '',
    age: row.age ?? 0,
    sex: row.sex ?? 'male',
    heightCm: row.height_cm ?? 0,
    weightKg: row.weight_kg ?? 0,
    fitnessLevel: row.fitness_level ?? 'beginner',
    goal: row.goal ?? 'general_fitness',
    equipment: row.equipment ?? 'gym_full',
    workoutDaysPerWeek: row.workout_days_per_week ?? 3,
    dietaryPreference: row.dietary_preference ?? 'no_preference',
    injuries: row.injuries ?? '',
    targetMotivation: row.target_motivation ?? '',
    activityLevel: row.activity_level ?? null,
    sessionDurationMinutes: row.session_duration_minutes ?? null,
    mainFrictions: row.main_frictions ?? [],
    interestSignals: row.interest_signals ?? [],
    selectedTrack: row.selected_track ?? null,
    onboardingCompleted: row.onboarding_completed ?? false,
    subscriptionTier: row.subscription_tier ?? 'free',
    stripeCustomerId: row.stripe_customer_id ?? undefined,
    stripeSubscriptionId: row.stripe_subscription_id ?? undefined,
    activeOrgId: row.active_org_id ?? undefined,
    isPlatformAdmin: row.is_platform_admin ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Store ──────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  /** Set to true when profile loading fails after attempt(s). Allows UI to
   *  distinguish "profile never loaded" from "profile load encountered an error". */
  profileError: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  signInWithGoogle: (next?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;

  isAuthenticated: () => boolean;
  isOnboardingCompleted: () => boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  profileError: false,

  isAuthenticated: () => !!get().user,
  isOnboardingCompleted: () => get().profile?.onboardingCompleted ?? false,

  initialize: async () => {
    // Guard: only initialize once
    if (get().initialized) return;

    set({ loading: true, initialized: true });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      set({ user });

      if (user) {
        await get().loadProfile(user.id);
      }
    } catch (err) {
      console.error('[auth] initialize error:', err);
    } finally {
      set({ loading: false });
    }

    // Listen for future auth changes (sign in, sign out, token refresh).
    // IMPORTANT: Skip INITIAL_SESSION — we already handled it above.
    // Without this guard, loadProfile fires twice on first load (race condition).
    supabase.auth.onAuthStateChange(async (event, session) => {
      // INITIAL_SESSION fires immediately after subscribe — skip it since
      // we already loaded the session above via getSession().
      if (event === 'INITIAL_SESSION') return;

      const user = session?.user ?? null;
      set({ user });

      if (event === 'SIGNED_OUT') {
        set({ profile: null, profileError: false, loading: false });
        return;
      }

      if (event === 'USER_UPDATED') {
        // Always reload profile on user update (email change, metadata update, etc.)
        if (user) await get().loadProfile(user.id);
      } else if (event === 'SIGNED_IN') {
        // For email/password sign-in: signIn() already awaited loadProfile() before
        // this event fires — skip if we already have the profile to avoid a wasteful
        // duplicate DB query. For Google OAuth: profile is never loaded before this
        // event (OAuth redirect bypasses signIn()), so always load in that case.
        const currentProfile = get().profile;
        if (user && (!currentProfile || currentProfile.id !== user.id)) {
          await get().loadProfile(user.id);
        }
      }

      // Always exit loading after any auth event
      set({ loading: false });
    });
  },

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Nesprávný e-mail nebo heslo.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: 'E-mail ještě nebyl potvrzen. Zkontroluj svou schránku.' };
        }
        if (error.message.includes('Too many requests')) {
          return { error: 'Příliš mnoho pokusů. Zkus to za chvíli.' };
        }
        return { error: 'Přihlášení selhalo. Zkus to prosím znovu.' };
      }

      if (data.user) {
        set({ user: data.user });
        await get().loadProfile(data.user.id);
      }

      return { error: null };
    } catch {
      return { error: 'Nastala neočekávaná chyba. Zkontroluj připojení.' };
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password, name) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${getAppUrl()}/auth/callback?next=/onboarding`,
        },
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          return { error: 'Tento e-mail je již registrován. Přihlas se místo toho.' };
        }
        if (error.message.includes('Password should be at least')) {
          return { error: 'Heslo musí mít alespoň 6 znaků.' };
        }
        return { error: 'Registrace selhala. Zkus to prosím znovu.' };
      }

      // identities === [] means the user already exists but email is unconfirmed
      if (data.user && data.user.identities?.length === 0) {
        return { error: 'Tento e-mail je již registrován. Přihlas se místo toho.' };
      }

      // If session is null, Supabase requires email confirmation
      if (!data.session) {
        return { error: null, needsConfirmation: true };
      }

      // Auto-confirmed (dev mode or email confirmation disabled)
      if (data.user) {
        set({ user: data.user });
        await get().loadProfile(data.user.id);
      }

      return { error: null, needsConfirmation: false };
    } catch {
      return { error: 'Nastala neočekávaná chyba. Zkontroluj připojení.' };
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async (next?: string) => {
    try {
      const base = `${getAppUrl()}/auth/callback`;
      const redirectTo = next && next.startsWith('/') && !next.startsWith('//')
        ? `${base}?next=${encodeURIComponent(next)}`
        : base;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });

      if (error) return { error: 'Přihlášení přes Google selhalo.' };
      return { error: null };
    } catch {
      return { error: 'Nastala neočekávaná chyba při přihlášení přes Google.' };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, profileError: false, loading: false });
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password`,
      });
      if (error) {
        if (error.message.includes('rate limit')) {
          return { error: 'Příliš mnoho pokusů. Zkus to za chvíli.' };
        }
        return { error: 'Nastala chyba. Zkontroluj e-mail a zkus to znovu.' };
      }
      return { error: null };
    } catch {
      return { error: 'Nastala neočekávaná chyba. Zkontroluj připojení.' };
    }
  },

  updatePassword: async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        if (error.message.includes('same password')) {
          return { error: 'Nové heslo musí být jiné než stávající.' };
        }
        return { error: 'Změna hesla selhala. Zkus to prosím znovu.' };
      }
      return { error: null };
    } catch {
      return { error: 'Nastala neočekávaná chyba.' };
    }
  },

  loadProfile: async (userId: string) => {
    // Clear error state on each fresh attempt
    set({ profileError: false });

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = row not found — handle below
        console.error('[auth] loadProfile error:', error);
        set({ profileError: true });
        return;
      }

      if (!data) {
        // Profile row missing — create a minimal one (handles missing DB trigger)
        const user = get().user;
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            email: user?.email ?? '',
            name: user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? '',
            onboarding_completed: false,
            subscription_tier: 'free',
          })
          .select()
          .single();

        if (insertError) {
          // 23505 = unique_violation — DB trigger already created the row, retry SELECT
          if (insertError.code === '23505') {
            const { data: retryData } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', userId)
              .single();
            if (retryData) {
              set({ profile: mapRowToProfile(retryData) });
            } else {
              set({ profileError: true });
            }
            return;
          }
          console.error('[auth] profile creation error:', insertError);
          set({ profileError: true });
          return;
        }

        if (newProfile) {
          set({ profile: mapRowToProfile(newProfile) });
        }
        return;
      }

      set({ profile: mapRowToProfile(data) });
    } catch (err) {
      console.error('[auth] loadProfile unexpected error:', err);
      set({ profileError: true });
    }
  },

  updateProfile: async (updates) => {
    const user = get().user;
    if (!user) return { error: 'Nejsi přihlášen.' };

    try {
      const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };

      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.age !== undefined) dbUpdates.age = updates.age;
      if (updates.sex !== undefined) dbUpdates.sex = updates.sex;
      if (updates.heightCm !== undefined) dbUpdates.height_cm = updates.heightCm;
      if (updates.weightKg !== undefined) dbUpdates.weight_kg = updates.weightKg;
      if (updates.fitnessLevel !== undefined) dbUpdates.fitness_level = updates.fitnessLevel;
      if (updates.goal !== undefined) dbUpdates.goal = updates.goal;
      if (updates.equipment !== undefined) dbUpdates.equipment = updates.equipment;
      if (updates.workoutDaysPerWeek !== undefined) dbUpdates.workout_days_per_week = updates.workoutDaysPerWeek;
      if (updates.dietaryPreference !== undefined) dbUpdates.dietary_preference = updates.dietaryPreference;
      if (updates.injuries !== undefined) dbUpdates.injuries = updates.injuries;
      if (updates.targetMotivation !== undefined) dbUpdates.target_motivation = updates.targetMotivation;
      if (updates.activityLevel !== undefined) dbUpdates.activity_level = updates.activityLevel;
      if (updates.sessionDurationMinutes !== undefined) dbUpdates.session_duration_minutes = updates.sessionDurationMinutes;
      if (updates.mainFrictions !== undefined) dbUpdates.main_frictions = updates.mainFrictions;
      if (updates.interestSignals !== undefined) dbUpdates.interest_signals = updates.interestSignals;
      if (updates.selectedTrack !== undefined) dbUpdates.selected_track = updates.selectedTrack;
      if (updates.onboardingCompleted !== undefined) dbUpdates.onboarding_completed = updates.onboardingCompleted;
      if (updates.subscriptionTier !== undefined) dbUpdates.subscription_tier = updates.subscriptionTier;
      if (updates.activeOrgId !== undefined) dbUpdates.active_org_id = updates.activeOrgId;

      const { error } = await supabase
        .from('user_profiles')
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) return { error: error.message };

      set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null,
      }));

      return { error: null };
    } catch {
      return { error: 'Nastala chyba při ukládání profilu.' };
    }
  },
}));
