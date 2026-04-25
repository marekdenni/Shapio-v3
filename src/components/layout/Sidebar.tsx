'use client';

// Desktop sidebar navigation — shows full platform section structure.
// Hidden on mobile (BottomNav used instead).
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: { text: string; variant: 'ai' | 'soon' };
}

interface NavSection {
  label: string;
  items: NavItem[];
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function UserStarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

// ── Nav sections config ───────────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Hlavní',
    items: [
      { href: '/dashboard', label: 'Přehled', icon: <HomeIcon /> },
      {
        href: '/coach',
        label: 'AI Kouč',
        icon: <BotIcon />,
        badge: { text: 'AI', variant: 'ai' },
      },
      { href: '/plan', label: 'Program', icon: <ClipboardIcon /> },
    ],
  },
  {
    label: 'Zdraví & Kondice',
    items: [
      { href: '/nutrition', label: 'Výživa', icon: <LeafIcon /> },
      { href: '/challenges', label: 'Výzvy', icon: <FlameIcon /> },
      { href: '/progress', label: 'Pokrok', icon: <ChartIcon /> },
    ],
  },
  {
    label: 'Objev',
    items: [
      {
        href: '/deals',
        label: 'Nabídky',
        icon: <TagIcon />,
        badge: { text: 'Brzy', variant: 'soon' },
      },
      {
        href: '/gyms',
        label: 'Posilovny',
        icon: <MapPinIcon />,
        badge: { text: 'Brzy', variant: 'soon' },
      },
      {
        href: '/coaches',
        label: 'Koučové',
        icon: <UserStarIcon />,
        badge: { text: 'Brzy', variant: 'soon' },
      },
      {
        href: '/videos',
        label: 'Videa',
        icon: <PlayIcon />,
        badge: { text: 'Brzy', variant: 'soon' },
      },
    ],
  },
  {
    label: 'Komunita',
    items: [
      {
        href: '/community',
        label: 'Komunita',
        icon: <UsersIcon />,
        badge: { text: 'Brzy', variant: 'soon' },
      },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function Sidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const { tier } = useSubscription();

  const tierBadge: Record<string, string> = {
    free: 'bg-surface2 text-text-secondary border border-border',
    starter: 'bg-blue-900/40 text-blue-400 border border-blue-700/40',
    pro: 'bg-cta/20 text-cta border border-cta/30',
    elite: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/30',
  };

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-surface border-r border-border z-40 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border shrink-0">
        <div className="w-8 h-8 bg-gradient-cta rounded-xl flex items-center justify-center shadow-glow-blue shrink-0">
          <span className="text-white font-black text-sm">G</span>
        </div>
        <span className="text-lg font-black text-text-primary tracking-tight">Get Beter</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-text-secondary/50">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                      isActive
                        ? 'bg-gradient-to-r from-cta/15 to-highlight/10 text-text-primary border border-cta/20'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface2',
                    ].join(' ')}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-cta to-highlight rounded-full" />
                    )}

                    {/* Icon */}
                    <span className={isActive ? 'text-cta' : 'text-text-secondary/60 group-hover:text-text-secondary'}>
                      {item.icon}
                    </span>

                    {/* Label */}
                    <span className="flex-1">{item.label}</span>

                    {/* Badge */}
                    {item.badge && (
                      <span
                        className={[
                          'px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide',
                          item.badge.variant === 'ai'
                            ? 'bg-cta/20 text-cta border border-cta/30'
                            : 'bg-surface2 text-text-secondary/50 border border-border/50',
                        ].join(' ')}
                      >
                        {item.badge.text}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User info + settings */}
      <div className="px-3 py-4 border-t border-border shrink-0 space-y-1">
        {/* User row */}
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-surface2 border border-border flex items-center justify-center text-xs font-bold text-text-primary shrink-0">
            {profile?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-text-primary truncate">
              {profile?.name ?? 'Uživatel'}
            </p>
            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${tierBadge[tier] ?? tierBadge.free}`}>
              {tier}
            </span>
          </div>
        </div>

        {/* Settings link */}
        <Link
          href="/settings"
          className={[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
            pathname === '/settings'
              ? 'bg-gradient-to-r from-cta/15 to-highlight/10 text-text-primary border border-cta/20'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface2',
          ].join(' ')}
        >
          <span className={pathname === '/settings' ? 'text-cta' : 'text-text-secondary/60'}>
            <SettingsIcon />
          </span>
          Nastavení
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
