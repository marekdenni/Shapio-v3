'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useAccessContext } from '@/hooks/useAccessContext';

const ADMIN_NAV = [
  { href: '/admin', label: 'Přehled', exact: true },
  { href: '/admin/users', label: 'Uživatelé', exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuthStore();
  const { isPlatformAdmin, loading: accessLoading } = useAccessContext();

  const loading = authLoading || accessLoading;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (!isPlatformAdmin) {
      router.replace('/dashboard');
    }
  }, [loading, user, isPlatformAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-glow-blue animate-pulse">
          <span className="text-white font-black text-lg tracking-tight">G</span>
        </div>
      </div>
    );
  }

  // Redirect in flight — render nothing to avoid flash
  if (!user || !isPlatformAdmin) return null;

  return (
    <div className="min-h-screen bg-background">

      {/* Admin header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 bg-gradient-cta rounded-lg flex items-center justify-center shadow-glow-blue shrink-0">
              <span className="text-white font-black text-xs tracking-tight">G</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-text-primary">Get Beter</span>
              <span className="px-1.5 py-0.5 bg-cta/10 border border-cta/20 rounded text-[9px] font-bold text-cta uppercase tracking-wider">Admin</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-0.5 flex-1">
            {ADMIN_NAV.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-cta/10 text-cta border border-cta/20'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface2',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Back to app */}
          <Link
            href="/dashboard"
            className="shrink-0 text-xs text-text-secondary/50 hover:text-text-secondary transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zpět do app
          </Link>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
