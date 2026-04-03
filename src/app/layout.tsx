import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'Shapio — AI-powered transformace těla',
  description:
    'Shapio analyzuje tvé tělo pomocí AI a vytvoří personalizovaný tréninkový a výživový plán. Začni svou transformaci ještě dnes.',
  keywords: ['fitness', 'transformace', 'AI trénink', 'výživa', 'hubnutí', 'nabírání svalů'],
  authors: [{ name: 'Shapio' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Shapio — AI transformace těla',
    description: 'Personalizovaný trénink a výživa powered by AI',
    type: 'website',
  },
  themeColor: '#0B0B0D',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-text-primary antialiased">
        {/* AuthProvider initializes Supabase session exactly once on mount */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
