'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Flame, Clock, PlusCircle, Search, Landmark, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsMobileMenuOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-950/70 backdrop-blur-xl border-b border-gray-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20"
          >
            <Landmark className="w-5 h-5" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-gray-100 uppercase leading-none">
              SHODASHA
            </span>
            <span className="text-[10px] block text-orange-400/90 font-bold uppercase tracking-widest mt-1 leading-none">
              Jantar Mantar Forum
            </span>
          </div>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation & Search */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Search Jantar Mantar rallies, policy reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-full pl-10 pr-4 py-2 text-[14px] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all shadow-inner"
              />
            </div>
          </form>

          <nav className="flex items-center gap-1 shrink-0 p-1 bg-gray-900/40 rounded-full border border-gray-800/80 backdrop-blur-sm">
            <Link href="/trending">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors", pathname === '/trending' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-gray-200')}
              >
                <Flame className={cn("w-3.5 h-3.5", pathname === '/trending' && "text-orange-500")} />
                Trending
              </motion.button>
            </Link>
            <Link href="/latest">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors", pathname === '/latest' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-gray-200')}
              >
                <Clock className="w-3.5 h-3.5" />
                Latest
              </motion.button>
            </Link>
          </nav>
          
          <Link href="/create">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="primary" size="sm" className="gap-1.5 text-[13px] rounded-full px-5 font-semibold bg-white text-gray-950 hover:bg-gray-200">
                <PlusCircle className="w-4 h-4" />
                Post Update
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-gray-950 border-b border-gray-800 px-4"
          >
            <div className="py-4 space-y-5">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-[15px] text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all"
                  />
                </div>
              </form>

              <nav className="flex flex-col gap-2">
                <Link href="/trending" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={cn("flex items-center gap-3 p-3 rounded-xl transition-colors", pathname === '/trending' ? 'bg-gray-900 text-white' : 'text-gray-400')}>
                    <Flame className={cn("w-5 h-5", pathname === '/trending' && "text-orange-500")} />
                    <span className="font-medium text-[15px]">Trending Discussions</span>
                  </div>
                </Link>
                <Link href="/latest" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={cn("flex items-center gap-3 p-3 rounded-xl transition-colors", pathname === '/latest' ? 'bg-gray-900 text-white' : 'text-gray-400')}>
                    <Clock className="w-5 h-5" />
                    <span className="font-medium text-[15px]">Latest Updates</span>
                  </div>
                </Link>
                <Link href="/create" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="mt-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-white text-gray-950 font-bold transition-colors">
                    <PlusCircle className="w-5 h-5" />
                    <span>Create New Post</span>
                  </div>
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
