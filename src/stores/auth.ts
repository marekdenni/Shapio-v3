'use client';

// Auth store — no persist middleware (Supabase manages sessions via cookies/localStorage)
// loading starts true, AuthProvider calls initialize() once on mount to resolve it
import { create } from 'zustand';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';

const supabase = createClientComponentClient();

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;

  isAuthenticated: () => boolean;
  isOnboardingCompleted: () => boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

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

    // Listen for future auth changes (sign in, sign out, token refresh)
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      set({ user });

      if (user) {
        await get().loadProfile(user.id);
      } else {
        set({ profile: null });
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
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${appUrl}/auth/callback?next=/onboarding`,
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

  signInWithGoogle: async () => {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${appUrl}/auth/callback`,
        },
      });

      if (error) return { error: 'Přihlášení přes Google selhalo.' };
      return { error: null };
    } catch {
      return { error: 'Nastala neočekávaná chyba při přihlášení přes Google.' };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, loading: false });
  },

  loadProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = row not found — handle below
        console.error('[auth] loadProfile error:', error);
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
          console.error('[auth] profile creation error:', insertError);
          return;
        }

        if (newProfile) {
          set({
            profile: {
              id: newProfile.id,
              name: newProfile.name || '',
              email: newProfile.email || '',
              age: 0,
              sex: 'male',
              heightCm: 0,
              weightKg: 0,
              fitnessLevel: 'beginner',
              goal: 'general_fitness',
              equipment: 'gym_full',
              workoutDaysPerWeek: 3,
              dietaryPreference: 'no_preference',
              injuries: '',
              targetMotivation: '',
              onboardingCompleted: false,
              subscriptionTier: 'free',
              createdAt: newProfile.created_at,
              updatedAt: newProfile.updated_at ?? undefined,
            },
          });
        }
        return;
      }

      set({
        profile: {
          id: data.id,
          name: data.name || '',
          email: data.email || '',
          age: data.age || 0,
          sex: data.sex || 'male',
          heightCm: data.height_cm || 0,
          weightKg: data.weight_kg || 0,
          fitnessLevel: data.fitness_level || 'beginner',
          goal: data.goal || 'general_fitness',
          equipment: data.equipment || 'gym_full',
          workoutDaysPerWeek: data.workout_days_per_week || 3,
          dietaryPreference: data.dietary_preference || 'no_preference',
          injuries: data.injuries || '',
          targetMotivation: data.target_motivation || '',
          onboardingCompleted: data.onboarding_completed || false,
          subscriptionTier: data.subscription_tier || 'free',
          stripeCustomerId: data.stripe_customer_id || undefined,
          stripeSubscriptionId: data.stripe_subscription_id || undefined,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
      });
    } catch (err) {
      console.error('[auth] loadProfile unexpected error:', err);
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
      if (updates.onboardingCompleted !== undefined) dbUpdates.onboarding_completed = updates.onboardingCompleted;
      if (updates.subscriptionTier !== undefined) dbUpdates.subscription_tier = updates.subscriptionTier;

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
