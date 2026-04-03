'use client';

// Initializes Supabase auth state exactly once on app mount.
// Must be placed inside the root layout so it runs before any page renders.
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
