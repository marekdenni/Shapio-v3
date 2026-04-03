'use client';

// App shell wrapper for authenticated pages
import React from 'react';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: React.ReactNode;
  hideBottomNav?: boolean;
}

export function AppShell({ children, hideBottomNav = false }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Main content with bottom padding for mobile bottom nav */}
      <main className={`flex-1 ${hideBottomNav ? 'pb-0' : 'pb-20 md:pb-0'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}

export default AppShell;
