'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@shodasha/shared';

export const CategoryNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar scroll-smooth">
      <Link
        href="/"
        className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors border ${
          pathname === '/'
            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]'
            : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        All Discussions
      </Link>

      {CATEGORIES.map((cat) => {
        const href = `/category/${cat.slug}`;
        const isActive = pathname === href;
        return (
          <Link
            key={cat.slug}
            href={href}
            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors border ${
              isActive
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {cat.name}
          </Link>
        );
      })}
    </nav>
  );
};
