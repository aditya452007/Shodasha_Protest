import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded-md active:scale-[0.98] min-h-[44px] min-w-[44px] px-4 select-none cursor-pointer';

  const variants = {
    primary:
      'bg-neutral-950 text-white hover:bg-neutral-800 focus:ring-neutral-950 border border-neutral-950 shadow-sm font-semibold',
    secondary:
      'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-950 border border-neutral-300 font-semibold',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 border border-red-600 font-semibold',
    outline:
      'bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-950 focus:ring-neutral-950 font-medium',
    ghost:
      'bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 focus:ring-neutral-950 font-medium',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2 min-h-[44px]',
    lg: 'text-base px-6 py-3 min-h-[48px]',
  };

  return (
    <button
      suppressHydrationWarning
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

