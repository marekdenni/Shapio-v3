'use client';

// Badge component for plan tier labels and status indicators
import React from 'react';
import type { SubscriptionTier } from '@/types';

type BadgeVariant = SubscriptionTier | 'popular' | 'new' | 'one-time' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  free: 'bg-surface2 text-text-secondary border border-border',
  starter: 'bg-blue-900/40 text-blue-400 border border-blue-700/50',
  pro: 'bg-primary/30 text-highlight border border-primary/50',
  elite: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/40',
  popular: 'bg-gradient-cta text-white border-0 shadow-glow-red',
  new: 'bg-green-900/40 text-green-400 border border-green-700/50',
  'one-time': 'bg-purple-900/40 text-purple-400 border border-purple-700/50',
  default: 'bg-surface2 text-text-secondary border border-border',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
};

export function Badge({
  variant = 'default',
  children,
  className = '',
  size = 'md',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center justify-center',
        'font-semibold uppercase tracking-wider rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}

export default Badge;
