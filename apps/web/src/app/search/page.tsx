'use client';

import React, { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { PostCard } from '@/components/post/PostCard';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/api';
import { Post } from '@shodasha/shared';

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = use(searchParams);
  const initialQuery = resolvedParams.q || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['search', activeQuery, page],
    queryFn: async () => {
      if (!activeQuery.trim()) return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
      const res = await fetchApi<Post[]>(
        `/api/v1/posts/search?q=${encodeURIComponent(activeQuery)}&page=${page}&limit=20`
      );
      return res;
    },
    enabled: activeQuery.trim().length > 0,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setActiveQuery(query.trim());
      setPage(1);
    }
  };

  const posts = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-black text-gray-100 tracking-tight flex items-center gap-2">
          <Search className="w-6 h-6 text-amber-500" />
          Full-Text Civic Search
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Search Jantar Mantar peaceful rallies, policy reviews, visitor accounts, and eyewitness event updates.
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Type keywords (e.g. farmers advocacy, transport accessibility, environmental bill)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <Button type="submit" variant="primary">
          Search
        </Button>
      </form>

      {activeQuery && (
        <p className="text-xs text-gray-400 font-mono">
          Showing search results for &quot;<span className="text-orange-400">{activeQuery}</span>&quot; ({meta?.total || 0} matches)
        </p>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 bg-gray-900/60 border border-gray-800/80 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

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
      ) : activeQuery ? (
        <div className="text-center py-12 bg-gray-900/40 border border-gray-800 rounded-xl p-8">
          <p className="text-gray-400 text-sm font-medium">
            No matching updates found for &quot;{activeQuery}&quot;.
          </p>
        </div>
      ) : null}
    </div>
  );
}
