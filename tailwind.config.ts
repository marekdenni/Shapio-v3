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
        // Shapio Design Tokens
        background: '#0B0B0D',
        surface: '#151518',
        surface2: '#1D1D22',
        primary: '#8B1E2D',
        cta: '#B3263E',
        highlight: '#D13A52',
        border: '#2A2A31',
        'text-primary': '#F5F5F5',
        'text-secondary': '#A1A1AA',
        // Aliases for convenience
        shapio: {
          bg: '#0B0B0D',
          surface: '#151518',
          surface2: '#1D1D22',
          primary: '#8B1E2D',
          cta: '#B3263E',
          highlight: '#D13A52',
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
        'glow-red': '0 0 20px rgba(179, 38, 62, 0.3)',
        'glow-red-lg': '0 0 40px rgba(179, 38, 62, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cta': 'linear-gradient(135deg, #8B1E2D 0%, #B3263E 50%, #D13A52 100%)',
        'gradient-dark': 'linear-gradient(180deg, #151518 0%, #0B0B0D 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'cta-pulse': 'ctaPulse 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
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
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(179, 38, 62, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(179, 38, 62, 0.6)' },
        },
        ctaPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(179, 38, 62, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(179, 38, 62, 0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
