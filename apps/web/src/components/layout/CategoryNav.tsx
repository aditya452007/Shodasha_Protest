'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@shodasha/shared';
import { cn } from '@/lib/utils';

export const CategoryNav: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { name: 'All Dispatches', href: '/' },
    ...CATEGORIES.map(c => ({ name: c.name, href: `/category/${c.slug}` }))
  ];

  return (
    <div className="border-b border-neutral-200 pb-3 my-2">
      <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth w-full">
        {links.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer",
                isActive 
                  ? "bg-neutral-950 text-white shadow-sm" 
                  : "bg-neutral-100/80 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-950 border border-neutral-200/60"
              )}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

