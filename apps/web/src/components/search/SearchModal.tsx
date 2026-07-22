'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '@shodasha/shared';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCategoryClick = (slug: string) => {
    onClose();
    router.push(`/category/${slug}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex items-start justify-center pt-16 md:pt-24 p-4 bg-neutral-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-xl bg-white border border-neutral-300 rounded-lg shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Search Input */}
          <form onSubmit={handleSearchSubmit} className="flex items-center px-4 py-3.5 border-b border-neutral-200">
            <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-3" />
            <input
              type="text"
              autoFocus
              placeholder="Search dispatches, laws, rallies, keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-sm font-medium text-neutral-950 placeholder-neutral-400 bg-transparent focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-neutral-400 hover:text-neutral-950 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-[10px] font-mono text-neutral-400 border border-neutral-200 rounded px-1.5 py-0.5">
                ESC
              </span>
            )}
          </form>

          {/* Body Content */}
          <div className="p-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
            {query.trim() ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSearchSubmit}
                  className="flex items-center justify-between p-3 rounded-md bg-neutral-100 hover:bg-neutral-950 text-neutral-950 hover:text-white transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <Search className="w-4 h-4 text-neutral-500 group-hover:text-amber-400" />
                    <span>Search for &quot;<strong className="font-bold">{query}</strong>&quot;</span>
                  </div>
                  <CornerDownLeft className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Categories Quick Jumps */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-2">
                    Quick Category Jumps
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className="flex items-center justify-between p-2.5 rounded border border-neutral-200 hover:border-neutral-950 bg-neutral-50 hover:bg-white text-xs font-semibold text-neutral-900 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Folder className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-950 shrink-0" />
                          <span className="truncate">{cat.name}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-neutral-950 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Keywords */}
                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-2">
                    Suggested Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['eyewitness', 'traffic alert', 'farmers rally', 'policy review', 'janpath access'].map((kw) => (
                      <button
                        key={kw}
                        onClick={() => {
                          setQuery(kw);
                          router.push(`/search?q=${encodeURIComponent(kw)}`);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-[11px] font-medium text-neutral-800 transition-colors font-mono cursor-pointer"
                      >
                        #{kw}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Shortcuts hint */}
          <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Full-Text Civic Search Archive
            </span>
            <span className="flex items-center gap-2">
              <span>Press <strong className="font-bold text-neutral-900">ESC</strong> to exit</span>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
