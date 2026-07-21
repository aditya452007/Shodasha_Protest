import React, { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  currentLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, maxLength, currentLength, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          {label && (
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {label}
            </label>
          )}
          {maxLength !== undefined && currentLength !== undefined && (
            <span
              className={`text-xs ${
                currentLength > maxLength ? 'text-red-400 font-bold' : 'text-gray-400'
              }`}
            >
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          maxLength={maxLength}
          className={`w-full bg-gray-900/80 border ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-800 focus:ring-orange-500 focus:border-orange-500'
          } rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-y min-h-[100px] ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
