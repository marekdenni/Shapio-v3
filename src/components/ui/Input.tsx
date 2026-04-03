'use client';

// Dark-themed input component with label, error state, and helper text
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  required,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-secondary mb-1.5"
        >
          {label}
          {required && <span className="text-cta ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full px-4 py-3',
          'bg-surface2 text-text-primary',
          'border rounded-xl',
          'placeholder:text-text-secondary/50',
          'focus:outline-none focus:ring-2 focus:ring-cta/40 focus:border-cta/60',
          'transition-all duration-200',
          'text-base',
          error ? 'border-red-500/70 bg-red-950/20' : 'border-border',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-text-secondary/70">{helperText}</p>
      )}
    </div>
  );
}

export default Input;
