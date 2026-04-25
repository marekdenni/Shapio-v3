import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // getbeter Design Tokens — blue + purple AI platform identity
        background: '#0B0B0D',
        surface: '#151518',
        surface2: '#1D1D22',
        primary: '#1E40AF',
        cta: '#3B82F6',
        highlight: '#7C3AED',
        border: '#2A2A31',
        'text-primary': '#F5F5F5',
        'text-secondary': '#A1A1AA',
        // Aliases for convenience
        getbeter: {
          bg: '#0B0B0D',
          surface: '#151518',
          surface2: '#1D1D22',
          primary: '#1E40AF',
          cta: '#3B82F6',
          highlight: '#7C3AED',
          border: '#2A2A31',
          'text-primary': '#F5F5F5',
          'text-secondary': '#A1A1AA',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'sans-serif',
        ],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-blue-lg': '0 0 40px rgba(59, 130, 246, 0.5)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-purple-lg': '0 0 40px rgba(124, 58, 237, 0.5)',
        // Keep legacy names so existing shadow-glow-red references don't break silently
        'glow-red': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-red-lg': '0 0 40px rgba(59, 130, 246, 0.5)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cta': 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #7C3AED 100%)',
        'gradient-dark': 'linear-gradient(180deg, #151518 0%, #0B0B0D 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-blue': 'pulseBlue 2s ease-in-out infinite',
        'cta-pulse': 'ctaPulse 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        // Legacy alias kept so existing animate-pulse-red references don't break silently
        'pulse-red': 'pulseBlue 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseBlue: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' },
        },
        ctaPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(59, 130, 246, 0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
