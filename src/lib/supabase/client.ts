'use client';

// Browser-side Supabase client for use in Client Components
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Create a singleton browser Supabase client
export const createClient = () => createClientComponentClient();

// Export a default instance for convenience in client components
export const supabase = createClientComponentClient();
