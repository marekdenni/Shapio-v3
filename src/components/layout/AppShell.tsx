'use client';

// App shell wrapper for authenticated pages.
// Desktop: fixed Sidebar (240px) + main content area.
// Mobile:  sticky AppHeader + main content + fixed BottomNav.
import React from 'react';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: React.ReactNode;
  hideBottomNav?: boolean;
}

export function AppShell({ children, hideBottomNav = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <Sidebar />

      {/* ── Content column: offset by sidebar width on desktop ── */}
      <div className="md:pl-60 flex flex-col min-h-screen">
        {/* Mobile-only top header */}
        <AppHeader />

        {/* Page content */}
        <main className={`flex-1 px-4 sm:px-6 md:px-8 py-6 md:py-8 ${hideBottomNav ? '' : 'pb-24 md:pb-8'}`}>
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile-only bottom navigation */}
        {!hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
}

export default AppShell;
