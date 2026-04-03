'use client';

// Dark-themed select/dropdown component
import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export function Select({
  label,
  error,
  helperText,
  options,
  placeholder,
  required,
  id,
  className = '',
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-text-secondary mb-1.5"
        >
          {label}
          {required && <span className="text-cta ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={[
            'w-full px-4 py-3 pr-10',
            'bg-surface2 text-text-primary',
            'border rounded-xl',
            'appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-cta/40 focus:border-cta/60',
            'transition-all duration-200',
            'text-base',
            error ? 'border-red-500/70' : 'border-border',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-5 w-5 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-text-secondary/70">{helperText}</p>
      )}
    </div>
  );
}

export default Select;
