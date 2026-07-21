'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@shodasha/shared';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const CategoryNav: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { name: 'All Discussions', href: '/' },
    ...CATEGORIES.map(c => ({ name: c.name, href: `/category/${c.slug}` }))
  ];

  return (
    <nav className="flex items-center gap-1.5 overflow-x-auto py-4 no-scrollbar scroll-smooth relative w-full">
      {links.map((link) => {
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors z-10",
              isActive ? "text-gray-950" : "text-gray-400 hover:text-gray-200"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-gray-100 rounded-full -z-10"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              />
            )}
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};
