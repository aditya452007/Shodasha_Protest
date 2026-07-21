'use client';

import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { PostCard } from '@/components/post/PostCard';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/api';
import { Post } from '@shodasha/shared';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const runtime = 'edge';

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(searchParams);
  const activeQuery = resolvedParams.q || '';
  const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;

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

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q') as string;
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}&page=1`);
    }
  };

  const posts = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-gray-100 tracking-tight flex items-center gap-3">
            <Search className="w-8 h-8 text-amber-500" />
            Full-Text Civic Search
          </h1>
          <p className="text-[15px] text-gray-400 mt-3 max-w-2xl leading-relaxed">
            Search Jantar Mantar peaceful rallies, policy reviews, visitor accounts, and eyewitness event updates.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-3">
        <div className="relative flex-1 group">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
          <input
            name="q"
            type="text"
            defaultValue={activeQuery}
            placeholder="Type keywords (e.g. farmers advocacy, transport accessibility, environmental bill)..."
            className="w-full bg-gray-900 border border-gray-800 rounded-full pl-12 pr-4 py-3.5 text-[15px] text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all shadow-inner"
          />
        </div>
        <Button type="submit" variant="primary" className="rounded-full px-8">
          Search
        </Button>
      </form>

      {activeQuery && (
        <p className="text-sm text-gray-400 font-medium">
          Showing search results for <span className="text-amber-400 font-bold">&quot;{activeQuery}&quot;</span> ({meta?.total || 0} matches)
        </p>
      )}

      <div className="min-h-[400px]">
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
              <div className="flex justify-center items-center gap-4 mt-10 mb-6">
                {page > 1 ? (
                  <Link href={`/search?q=${encodeURIComponent(activeQuery)}&page=${page - 1}`}>
                    <Button variant="outline" size="sm" className="rounded-full px-6">Previous</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-full px-6 opacity-50 cursor-not-allowed" disabled>Previous</Button>
                )}
                
                <span className="text-sm text-gray-400 font-medium bg-gray-900/50 px-4 py-1.5 rounded-full border border-gray-800">
                  Page {page} of {meta.totalPages}
                </span>

                {page < meta.totalPages ? (
                  <Link href={`/search?q=${encodeURIComponent(activeQuery)}&page=${page + 1}`}>
                    <Button variant="outline" size="sm" className="rounded-full px-6">Next</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-full px-6 opacity-50 cursor-not-allowed" disabled>Next</Button>
                )}
              </div>
            )}
          </div>
        ) : activeQuery ? (
          <div className="text-center py-16 bg-gray-900/40 border border-gray-800 rounded-2xl shadow-sm">
            <p className="text-gray-400 text-[15px] font-medium">
              No matching updates found for &quot;{activeQuery}&quot;.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
