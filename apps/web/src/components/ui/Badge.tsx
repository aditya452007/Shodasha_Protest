import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'red' | 'gray' | 'emerald' | 'black';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'orange',
  className = '',
}) => {
  const styles = {
    orange: 'bg-amber-50 text-amber-900 border-amber-200/80',
    red: 'bg-red-50 text-red-900 border-red-200',
    gray: 'bg-neutral-100 text-neutral-800 border-neutral-200',
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    black: 'bg-neutral-950 text-white border-neutral-950',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

