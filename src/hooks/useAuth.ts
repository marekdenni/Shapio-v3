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
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: string | null }>;
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
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    updateProfile: store.updateProfile,
    requireAuth,
  };
}