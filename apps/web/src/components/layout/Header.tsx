'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Flame, Clock, PlusCircle, Search, Landmark, Menu, X } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-9 h-9 rounded-lg bg-[var(--accent-orange)] flex items-center justify-center text-[var(--bg-primary)] font-bold shadow-lg group-hover:scale-105 transition-transform">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider text-[var(--text-primary)] uppercase">
              SHODASHA
            </span>
            <span className="text-[10px] block text-[var(--accent-orange)] font-semibold uppercase tracking-widest -mt-1">
              Jantar Mantar Forum
            </span>
          </div>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation & Search */}
        <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
          <form onSubmit={handleSearch} className="flex-1 max-w-md min-w-[200px]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search Jantar Mantar rallies, policy reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full pl-9 pr-4 py-2 text-[13px] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-secondary)] transition-all"
              />
            </div>
          </form>

          <nav className="flex items-center gap-2 shrink-0">
            <Link href="/trending">
              <Button variant={pathname === '/trending' ? 'primary' : 'ghost'} size="sm" className="gap-1.5 text-[13px]">
                <Flame className="w-4 h-4" />
                Trending
              </Button>
            </Link>
            <Link href="/latest">
              <Button variant={pathname === '/latest' ? 'primary' : 'ghost'} size="sm" className="gap-1.5 text-[13px]">
                <Clock className="w-4 h-4" />
                Latest
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="primary" size="sm" className="gap-1.5 text-[13px]">
                <PlusCircle className="w-4 h-4" />
                Create Post
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-4 py-4 space-y-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full pl-9 pr-4 py-2.5 text-[14px] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-secondary)] transition-all"
              />
            </div>
          </form>

          <nav className="flex flex-col gap-2">
            <Link href="/trending" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant={pathname === '/trending' ? 'primary' : 'ghost'} className="w-full justify-start gap-2 text-[14px]">
                <Flame className="w-4 h-4" />
                Trending Discussions
              </Button>
            </Link>
            <Link href="/latest" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant={pathname === '/latest' ? 'primary' : 'ghost'} className="w-full justify-start gap-2 text-[14px]">
                <Clock className="w-4 h-4" />
                Latest Updates
              </Button>
            </Link>
            <Link href="/create" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-start gap-2 text-[14px]">
                <PlusCircle className="w-4 h-4" />
                Create New Post
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
