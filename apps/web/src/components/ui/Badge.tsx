import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'red' | 'gray' | 'emerald';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'orange',
  className = '',
}) => {
  const styles = {
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    red: 'bg-red-500/10 text-red-400 border-red-500/30',
    gray: 'bg-gray-800 text-gray-300 border-gray-700',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
