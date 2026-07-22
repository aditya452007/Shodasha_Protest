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
            <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              {label}
            </label>
          )}
          {maxLength !== undefined && currentLength !== undefined && (
            <span
              className={`text-xs ${
                currentLength > maxLength ? 'text-red-600 font-bold' : 'text-neutral-500'
              }`}
            >
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          maxLength={maxLength}
          className={`w-full bg-white border ${
            error ? 'border-red-600 focus:ring-2 focus:ring-red-600/20' : 'border-neutral-300 focus:ring-2 focus:ring-neutral-950/10 focus:border-neutral-950'
          } rounded-md px-4 py-3 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none transition-all resize-y min-h-[100px] ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

