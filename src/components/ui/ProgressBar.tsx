'use client';

// Animated progress bar component with Shapio dark styling
import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'red' | 'blue' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

const colorClasses = {
  red: 'bg-cta',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
};

const heightClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  color = 'red',
  size = 'md',
  className = '',
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-text-secondary">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-text-primary ml-auto">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-surface2 rounded-full overflow-hidden border border-border/50 ${heightClasses[size]}`}
      >
        <div
          className={[
            colorClasses[color],
            heightClasses[size],
            'rounded-full',
            animated ? 'transition-all duration-700 ease-out' : '',
          ].join(' ')}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemax={max}
          aria-valuemin={0}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
