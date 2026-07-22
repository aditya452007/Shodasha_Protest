'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PostCard } from '@/components/post/PostCard';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { Button } from '@/components/ui/Button';
import { FeedViewToggle, FeedViewMode } from '@/components/post/FeedViewToggle';
import { useSSE } from '@/hooks/useSSE';
import { fetchApi } from '@/lib/api';
import { Post } from '@shodasha/shared';

export function FeedClient() {
  useSSE();
  const [sort, setSort] = useState<'trending' | 'latest' | 'top'>('trending');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<FeedViewMode>('cards');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts', sort, page],
    queryFn: async () => {
      const res = await fetchApi<Post[]>(
        `/api/v1/posts?sort=${sort}&page=${page}&limit=20`
      );
      return res;
    },
  });

  const posts = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Newspaper Masthead Hero Banner */}
      <div className="bg-white border-2 border-neutral-950 rounded-lg p-8 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-neutral-950 bg-neutral-100 px-3 py-1 rounded border border-neutral-300 font-mono">
            Official Civic Dispatch • New Delhi
          </span>
          <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
            Jantar Mantar Open Forum
          </span>
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="font-serif text-3xl md:text-5xl font-black tracking-tight text-neutral-950 leading-tight">
            Jantar Mantar Public Assembly & Civic Forum
          </h1>
          <p className="text-sm md:text-base text-neutral-700 mt-3 leading-relaxed font-sans max-w-2xl">
            A transparent citizen publishing portal providing verified eyewitness accounts, peaceful rally perspectives, law reviews, and community updates centered at Jantar Mantar, New Delhi.
          </p>
        </div>
      </div>

      <CategoryNav />

      {/* Feed Filter Sub-Bar & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-3 gap-4 mt-1">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-lg font-bold text-neutral-950 tracking-tight uppercase">
            Public Dispatches
          </h2>
          <FeedViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        <div className="flex bg-neutral-100 border border-neutral-200 rounded p-1">
          {(['trending', 'latest', 'top'] as const).map((s) => (
            <button
              key={s}
              suppressHydrationWarning
              onClick={() => {
                setSort(s);
                setPage(1);
              }}
              className={`px-3.5 py-1 text-xs font-bold transition-all duration-150 cursor-pointer rounded ${
                sort === s
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/70'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Posts */}
      <div className="min-h-[500px]">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-44 bg-neutral-100/80 border border-neutral-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 rounded-lg bg-red-50 border border-red-200 text-center text-red-700 text-xs font-semibold">
            Failed to load dispatches: {(error as Error).message}
          </div>
        ) : posts.length > 0 ? (
          <div className={viewMode === 'compact' ? "flex flex-col gap-2" : "flex flex-col gap-4"}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Pagination Controls */}
            {meta && meta.totalPages && meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded px-5 text-xs font-bold"
                >
                  Previous
                </Button>
                <span className="text-xs font-mono font-semibold text-neutral-700 bg-neutral-100 px-4 py-1.5 rounded border border-neutral-200">
                  Page {page} of {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))}
                  disabled={page >= meta.totalPages}
                  className="rounded px-5 text-xs font-bold"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-neutral-50 border border-neutral-200 rounded-lg">
            <p className="text-neutral-600 text-xs font-medium">No dispatches found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}


