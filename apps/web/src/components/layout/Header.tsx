'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Flame, Clock, PlusCircle, Search, Landmark, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { SearchModal } from '../search/SearchModal';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    setCurrentDate(now.toLocaleDateString('en-US', options));
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsMobileMenuOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
        {/* Top Editorial Utility Strip */}
        <div className="hidden md:flex border-b border-neutral-100 bg-neutral-50 px-4 py-1.5 text-[11px] font-medium text-neutral-600 justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-neutral-900">{currentDate || 'Jantar Mantar Civic Dispatch'}</span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1.5 text-neutral-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              New Delhi Monitor Live
            </span>
          </div>
          <div className="flex items-center gap-4 text-neutral-600 font-mono">
            <span>Press <kbd className="bg-neutral-200 text-neutral-900 px-1 py-0.5 rounded text-[10px] font-bold">Cmd</kbd> + <kbd className="bg-neutral-200 text-neutral-900 px-1 py-0.5 rounded text-[10px] font-bold">K</kbd> to search</span>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
          {/* Brand Masthead */}
          <Link href="/" className="flex items-center gap-3 group shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-10 h-10 rounded bg-neutral-950 flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl tracking-tight text-neutral-950 uppercase leading-none">
                SHODASHA
              </span>
              <span className="text-[10px] block text-neutral-500 font-bold uppercase tracking-widest mt-1 leading-none">
                Jantar Mantar Civic Forum
              </span>
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2.5 text-neutral-700 hover:text-neutral-950 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Search & Navigation */}
          <div className="hidden md:flex items-center gap-5 flex-1 justify-end">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex-1 max-w-sm flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md px-3.5 py-1.5 text-xs text-neutral-500 hover:text-neutral-950 transition-all cursor-pointer min-h-[36px]"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-neutral-400" />
                <span>Search dispatches & laws...</span>
              </div>
              <span className="font-mono text-[10px] text-neutral-400 border border-neutral-200 bg-white rounded px-1.5 py-0.5">
                ⌘K
              </span>
            </button>

            <nav className="flex items-center gap-1 border-l border-neutral-200 pl-4">
              <Link href="/trending">
                <button 
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer min-h-[36px]",
                    pathname === '/trending' ? 'bg-neutral-950 text-white' : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
                  )}
                >
                  <Flame className={cn("w-3.5 h-3.5", pathname === '/trending' ? "text-amber-400" : "text-neutral-500")} />
                  Trending
                </button>
              </Link>
              <Link href="/latest">
                <button 
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer min-h-[36px]",
                    pathname === '/latest' ? 'bg-neutral-950 text-white' : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
                  )}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Latest
                </button>
              </Link>
            </nav>
            
            <Link href="/create">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs rounded-md px-4 font-bold bg-neutral-950 text-white hover:bg-neutral-800 min-h-[36px]">
                <PlusCircle className="w-4 h-4" />
                Post Update
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer & Backdrop */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden fixed inset-0 top-[65px] bg-neutral-950/40 z-40 backdrop-blur-xs"
              />

              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden relative z-50 overflow-hidden bg-white border-b border-neutral-200 px-4 shadow-xl"
              >
                <div className="py-4 space-y-4">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search dispatches & keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-md pl-10 pr-4 py-3 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-neutral-950 min-h-[44px]"
                      />
                    </div>
                  </form>

                  <nav className="flex flex-col gap-2">
                    <Link href="/trending" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={cn("flex items-center gap-3 p-3 rounded-md transition-colors min-h-[44px]", pathname === '/trending' ? 'bg-neutral-950 text-white font-bold' : 'text-neutral-800 hover:bg-neutral-100')}>
                        <Flame className={cn("w-4 h-4", pathname === '/trending' ? "text-amber-400" : "text-neutral-500")} />
                        <span className="text-sm font-semibold">Trending Discussions</span>
                      </div>
                    </Link>
                    <Link href="/latest" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={cn("flex items-center gap-3 p-3 rounded-md transition-colors min-h-[44px]", pathname === '/latest' ? 'bg-neutral-950 text-white font-bold' : 'text-neutral-800 hover:bg-neutral-100')}>
                        <Clock className="w-4 h-4 text-neutral-500" />
                        <span className="text-sm font-semibold">Latest Dispatches</span>
                      </div>
                    </Link>
                    <Link href="/create" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="mt-1 flex items-center justify-center gap-2 p-3 rounded-md bg-neutral-950 text-white font-bold text-sm transition-colors min-h-[44px]">
                        <PlusCircle className="w-4 h-4" />
                        <span>Create New Post</span>
                      </div>
                    </Link>
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Command Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};



