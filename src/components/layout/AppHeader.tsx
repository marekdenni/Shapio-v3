'use client';

// Mobile-only top header for authenticated app pages.
// Shown on small screens; desktop uses Sidebar instead.
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Přehled',
  '/coach': 'AI Kouč',
  '/plan': 'Program',
  '/nutrition': 'Výživa',
  '/challenges': 'Výzvy',
  '/progress': 'Pokrok',
  '/deals': 'Nabídky',
  '/gyms': 'Posilovny',
  '/community': 'Komunita',
  '/coaches': 'Koučové',
  '/videos': 'Videa',
  '/settings': 'Nastavení',
};

export function AppHeader() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const title = PAGE_TITLES[pathname] ?? 'Get Beter';

  return (
    <header className="md:hidden sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo + page title */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gradient-cta rounded-lg flex items-center justify-center shrink-0 shadow-glow-blue">
            <span className="text-white font-black text-xs">G</span>
          </div>
          <span className="text-base font-bold text-text-primary">{title}</span>
        </div>

        {/* User avatar → settings */}
        <Link
          href="/settings"
          className="w-8 h-8 rounded-full bg-surface2 border border-border flex items-center justify-center text-sm font-bold text-text-primary hover:border-cta/40 transition-colors"
        >
          {profile?.name?.[0]?.toUpperCase() ?? 'U'}
        </Link>
      </div>
    </header>
  );
}

export default AppHeader;
