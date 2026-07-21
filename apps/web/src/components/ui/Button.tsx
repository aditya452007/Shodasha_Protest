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
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg active:scale-98 min-h-[44px] min-w-[44px] px-4 select-none cursor-pointer';

  const variants = {
    primary:
      'bg-orange-600 text-white hover:bg-orange-500 focus:ring-orange-500 bg-gradient-to-r from-orange-600 to-amber-600 border border-orange-500/20 shadow-sm',
    secondary:
      'bg-gray-800 text-gray-100 hover:bg-gray-700 focus:ring-gray-500 border border-gray-700',
    danger:
      'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 border border-red-500/20',
    outline:
      'bg-transparent text-gray-200 border border-gray-700 hover:bg-gray-800 focus:ring-gray-500',
    ghost:
      'bg-transparent text-gray-300 hover:bg-gray-800/60 hover:text-white focus:ring-gray-500',
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
