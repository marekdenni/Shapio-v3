'use client';

// Card component with Shapio dark design system
import React from 'react';

type CardVariant = 'default' | 'elevated' | 'premium';

interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-surface border border-border',
  elevated: 'bg-surface2 border border-border shadow-card',
  premium:
    'bg-surface2 border border-cta/50 shadow-glow-red ring-1 ring-cta/20',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export function Card({
  variant = 'default',
  children,
  className = '',
  onClick,
  padding = 'md',
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'rounded-2xl',
        variantClasses[variant],
        paddingClasses[padding],
        onClick ? 'cursor-pointer hover:border-border/80 transition-all duration-200' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

export default Card;
