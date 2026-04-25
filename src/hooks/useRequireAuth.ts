'use client';

// Shared auth guard hook — eliminates duplicated logic between (app)/layout.tsx
// and org/layout.tsx. Handles profile retry with bounded attempts, auth redirect,
// and returns structured state for layout rendering decisions.
import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types';

const MAX_PROFILE_RETRIES = 2;

export interface RequireAuthState {
  /** Supabase user object (null while loading or if unauthenticated). */
  user: User | null;
  /** Mapped profile from user_profiles (null if not yet loaded). */
  profile: UserProfile | null;
  /** True while initial auth or profile is resolving. */
  loading: boolean;
  /** True when profile load failed after all retry attempts. */
  profileFailed: boolean;
  /** True when profile load failed AND retries are exhausted. */
  profileError: boolean;
  /** Manually retry profile load (resets retry counter). */
  retryProfile: () => void;
}

/**
 * Shared hook for authenticated layouts. Handles:
 * - Redirecting unauthenticated users to /login
 * - Retrying profile loads with bounded attempts
 * - Exposing clear state for rendering decisions
 *
 * Does NOT enforce onboarding — that's the caller's responsibility
 * (since org routes intentionally skip onboarding checks).
 */
export function useRequireAuth(): RequireAuthState {
  const router = useRouter();
  const { user, profile, loading, loadProfile, profileError: storeProfileError } = useAuthStore();
  const retryCount = useRef(0);

  // If user is authenticated but profile failed to load, retry with a limit
  const retryLoad = useCallback(() => {
    if (user?.id && retryCount.current < MAX_PROFILE_RETRIES) {
      retryCount.current += 1;
      loadProfile(user.id);
    }
  }, [user?.id, loadProfile]);

  useEffect(() => {
    if (!loading && user && !profile && !storeProfileError) {
      retryLoad();
    }
  }, [loading, user, profile, storeProfileError, retryLoad]);

  // Reset retry counter when profile loads successfully
  useEffect(() => {
    if (profile) {
      retryCount.current = 0;
    }
  }, [profile]);

  // Redirect to login if auth resolved and no user (fallback — middleware is primary guard)
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  const profileFailed = !loading && !!user && !profile && (
    retryCount.current >= MAX_PROFILE_RETRIES || storeProfileError
  );

  return {
    user,
    profile,
    loading,
    profileFailed,
    profileError: profileFailed,
    retryProfile: () => {
      retryCount.current = 0;
      if (user?.id) loadProfile(user.id);
    },
  };
}
