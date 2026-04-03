// Centralized app configuration — reads from environment variables
// All auth redirect URLs should use APP_URL, never hardcoded localhost

export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
};

// Auth redirect URLs — always derived from APP_URL for correct env behavior
export const authConfig = {
  redirectTo: `${config.appUrl}/auth/callback`,
  loginUrl: `${config.appUrl}/login`,
  dashboardUrl: `${config.appUrl}/dashboard`,
  onboardingUrl: `${config.appUrl}/onboarding`,
};
