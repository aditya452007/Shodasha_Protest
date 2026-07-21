'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PostCard } from '@/components/post/PostCard';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { Button } from '@/components/ui/Button';
import { useSSE } from '@/hooks/useSSE';
import { fetchApi } from '@/lib/api';
import { Post } from '@shodasha/shared';

export function FeedClient() {
  useSSE();
  const [sort, setSort] = useState<'trending' | 'latest' | 'top'>('trending');
  const [page, setPage] = useState(1);

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
      {/* Banner - Modern Minimalist */}
      <div className="bg-gradient-to-br from-[var(--bg-card)] to-gray-950 border border-[var(--border-color)] rounded-2xl p-8 shadow-md relative overflow-hidden">
        {/* Subtle decorative elements for premium look */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10">
          <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full">
            Jantar Mantar Public Forum
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] mt-5">
            Civic Discussion <br className="hidden md:block"/>& Event Portal
          </h1>
          <p className="text-[15px] text-[var(--text-secondary)] mt-4 max-w-2xl leading-relaxed">
            A transparent community platform to share visitor experiences, eyewitness event updates, policy discussions, and peaceful rally perspectives at Jantar Mantar, New Delhi.
          </p>
        </div>
      </div>

      <CategoryNav />

      {/* Feed Filter Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-color)] pb-4 gap-4 mt-2">
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Jantar Mantar Civic Feed</h2>
        <div className="flex bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-1 shadow-sm">
          {(['trending', 'latest', 'top'] as const).map((s) => (
            <button
              key={s}
              suppressHydrationWarning
              onClick={() => {
                setSort(s);
                setPage(1);
              }}
              className={`px-4 py-1.5 text-sm font-semibold transition-all duration-200 cursor-pointer rounded-md ${
                sort === s
                  ? 'bg-gray-800 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
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
                className="h-44 bg-gray-900/60 border border-gray-800/80 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-center text-red-400 text-sm font-medium">
            Failed to load posts: {(error as Error).message}
          </div>
        ) : posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Pagination Controls */}
            {meta && meta.totalPages && meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-full px-6"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-400 font-medium bg-gray-900/50 px-4 py-1.5 rounded-full border border-gray-800">
                  Page {page} of {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))}
                  disabled={page >= meta.totalPages}
                  className="rounded-full px-6"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-sm">
            <p className="text-gray-400 text-sm font-medium">No posts found in this feed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
