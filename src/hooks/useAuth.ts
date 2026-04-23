'use client';

// Hook for authentication state and actions
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import type { UserProfile } from '@/types';

interface UseAuthReturn {
  user: any; 
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isOnboardingCompleted: boolean;
  /** True when profile loading encountered an error. */
  profileError: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  requireAuth: (router: ReturnType<typeof useRouter>) => boolean;
}

export function useAuth(): UseAuthReturn {
  const store = useAuthStore();

  /**
   * Ensures user is authenticated. Redirects to /login if not.
   * Returns true if authenticated, false if redirect was triggered.
   */
  const requireAuth = (router: ReturnType<typeof useRouter>): boolean => {
    if (!store.user && !store.loading) {
      router.push('/login');
      return false;
    }
    return true;
  };

  return {
    user: store.user,
    profile: store.profile,
    loading: store.loading,
    isAuthenticated: store.isAuthenticated(),
    isOnboardingCompleted: store.isOnboardingCompleted(),
    profileError: store.profileError,
    signIn: store.signIn,
    signUp: store.signUp,
    signInWithGoogle: store.signInWithGoogle,
    signOut: store.signOut,
    updateProfile: store.updateProfile,
    resetPassword: store.resetPassword,
    updatePassword: store.updatePassword,
    requireAuth,
  };
}