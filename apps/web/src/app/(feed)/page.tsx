'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PostCard } from '@/components/post/PostCard';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { Button } from '@/components/ui/Button';
import { useSSE } from '@/hooks/useSSE';
import { fetchApi } from '@/lib/api';
import { Post } from '@shodasha/shared';

export default function HomePage() {
  useSSE(); // Live SSE score/post updates
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
    <div className="flex flex-col gap-6">
      {/* Banner - Modern Minimalist */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm">
        <span className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent-orange)] bg-[var(--accent-orange-dim)] px-2.5 py-1 rounded-full">
          Jantar Mantar Public Forum
        </span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-4">
          Civic Discussion & Event Portal
        </h1>
        <p className="text-[15px] text-[var(--text-secondary)] mt-3 max-w-2xl leading-[1.6]">
          A transparent community platform to share visitor experiences, eyewitness event updates, policy discussions, and peaceful rally perspectives at Jantar Mantar, New Delhi.
        </p>
      </div>

      <CategoryNav />

      {/* Feed Filter Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-color)] pb-4 gap-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Jantar Mantar Civic Feed</h2>
        <div className="flex gap-2">
          {(['trending', 'latest', 'top'] as const).map((s) => (
            <button
              key={s}
              suppressHydrationWarning
              onClick={() => {
                setSort(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-[13px] font-medium transition-colors cursor-pointer rounded-md ${
                sort === s
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-[var(--shadow-sm)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] border border-transparent'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Posts */}
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
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-center text-red-400 text-sm">
          Failed to load posts: {(error as Error).message}
        </div>
      ) : posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Pagination Controls */}
          {meta && meta.totalPages && meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-xs text-gray-400 font-mono">
                Page {page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))}
                disabled={page >= meta.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-900/40 border border-gray-800 rounded-xl p-8">
          <p className="text-gray-400 text-sm font-medium">No posts found in this feed.</p>
        </div>
      )}
    </div>
  );
}
