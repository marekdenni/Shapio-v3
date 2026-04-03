'use client';

// Navbar component - adapts between landing and app modes
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, profile, signOut } = useAuth();
  const { tier } = useSubscription();
  const [menuOpen, setMenuOpen] = useState(false);

  // Determine if we're in the app or on a landing/auth page
  const isAppPage =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/plan') ||
    pathname.startsWith('/nutrition') ||
    pathname.startsWith('/progress') ||
    pathname.startsWith('/coach') ||
    pathname.startsWith('/settings');

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-cta rounded-lg flex items-center justify-center shadow-glow-red">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-xl font-black text-text-primary tracking-tight">
              Shapio
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && isAppPage ? (
              // App navigation
              <>
                <Link
                  href="/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/dashboard'
                      ? 'text-white bg-[#B3263E]/20 border border-[#B3263E]/40'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface2'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/plan"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/plan'
                      ? 'text-white bg-[#B3263E]/20 border border-[#B3263E]/40'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface2'
                  }`}
                >
                  Plán
                </Link>
                <Link
                  href="/coach"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/coach'
                      ? 'text-white bg-[#B3263E]/20 border border-[#B3263E]/40'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface2'
                  }`}
                >
                  AI Kouč
                </Link>
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                  {/* Tier badge with color coding */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    tier === 'elite' ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/40' :
                    tier === 'pro' ? 'bg-[#B3263E]/20 text-[#B3263E] border border-[#B3263E]/40' :
                    tier === 'starter' ? 'bg-blue-900/40 text-blue-400 border border-blue-700/40' :
                    'bg-surface2 text-text-secondary border border-border'
                  }`}>
                    {tier.toUpperCase()}
                  </span>
                  <Link
                    href="/settings"
                    className="w-8 h-8 rounded-full bg-surface2 border border-border flex items-center justify-center text-sm font-semibold text-text-primary hover:border-cta/50 transition-colors"
                  >
                    {profile?.name?.[0]?.toUpperCase() || 'U'}
                  </Link>
                </div>
              </>
            ) : (
              // Landing navigation
              <>
                <Link href="/jak-to-funguje" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-2">
                  Jak to funguje
                </Link>
                <Link href="/#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-2">
                  Ceník
                </Link>
                {!isAuthenticated ? (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Přihlásit se
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="primary" size="sm">
                        Začít zdarma
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/dashboard">
                    <Button variant="primary" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface2 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-4 py-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 pb-3 mb-2 border-b border-border">
                  <div className="w-9 h-9 rounded-full bg-surface2 border border-border flex items-center justify-center text-sm font-semibold text-text-primary">
                    {profile?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{profile?.name || 'Uživatel'}</p>
                    <Badge variant={tier} size="sm">{tier.toUpperCase()}</Badge>
                  </div>
                </div>
                <Link href="/dashboard" className="py-2 px-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface2 text-sm" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/plan" className="py-2 px-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface2 text-sm" onClick={() => setMenuOpen(false)}>
                  Tréninkový plán
                </Link>
                <Link href="/nutrition" className="py-2 px-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface2 text-sm" onClick={() => setMenuOpen(false)}>
                  Výživa
                </Link>
                <Link href="/settings" className="py-2 px-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface2 text-sm" onClick={() => setMenuOpen(false)}>
                  Nastavení
                </Link>
                <button onClick={handleSignOut} className="py-2 px-3 rounded-lg text-red-400 hover:bg-red-900/20 text-sm text-left mt-2">
                  Odhlásit se
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="secondary" fullWidth>Přihlásit se</Button>
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  <Button variant="primary" fullWidth>Začít zdarma</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
