// Server-side Supabase clients for use in Server Components and Server Actions
import { createServerComponentClient, createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for use in Server Components.
 * Reads the session from cookies automatically.
 */
export const createServerClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
};

/**
 * Creates a Supabase client for use in Server Actions.
 * Uses cookies() from next/headers.
 */
export const createActionClient = () => {
  const cookieStore = cookies();
  return createServerActionClient({ cookies: () => cookieStore });
};

/**
 * Creates an admin Supabase client with the service role key.
 * Only use server-side, never expose to the client.
 */
export const createAdminClient = () => {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
