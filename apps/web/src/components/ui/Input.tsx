import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-white border ${
            error ? 'border-red-600 focus:ring-2 focus:ring-red-600/20' : 'border-neutral-300 focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950'
          } rounded-md px-4 py-2.5 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none transition-all min-h-[44px] ${className}`}
          {...props}
        />
        {error ? (
          <span className="text-xs text-red-600 font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-neutral-500">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

