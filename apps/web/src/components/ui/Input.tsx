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
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-gray-900/80 border ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-800 focus:ring-orange-500 focus:border-orange-500'
          } rounded-lg px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all min-h-[44px] ${className}`}
          {...props}
        />
        {error ? (
          <span className="text-xs text-red-400 font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-gray-400">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
