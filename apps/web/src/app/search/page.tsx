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
      <div className="bg-white border-2 border-neutral-950 rounded-lg p-8 shadow-sm">
        <div className="max-w-2xl">
          <h1 className="font-serif text-2xl md:text-3xl font-black text-neutral-950 tracking-tight flex items-center gap-2.5">
            <Search className="w-6 h-6 text-neutral-950" />
            Full-Text Civic Search Archive
          </h1>
          <p className="text-xs md:text-sm text-neutral-700 mt-2 leading-relaxed font-sans">
            Search Jantar Mantar peaceful rallies, policy reviews, visitor accounts, and eyewitness event dispatches.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1 group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-950 transition-colors" />
          <input
            name="q"
            type="text"
            defaultValue={activeQuery}
            placeholder="Type keywords (e.g. farmers advocacy, transport accessibility, environmental bill)..."
            className="w-full bg-white border border-neutral-300 rounded-md pl-10 pr-4 py-2.5 text-xs md:text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-all"
          />
        </div>
        <Button type="submit" variant="primary" className="rounded-md px-6 text-xs font-bold bg-neutral-950 text-white hover:bg-neutral-800">
          Search Archive
        </Button>
      </form>

      {activeQuery && (
        <p className="text-xs font-mono text-neutral-600">
          Search results for <span className="text-neutral-950 font-bold font-sans">&quot;{activeQuery}&quot;</span> ({meta?.total || 0} matches)
        </p>
      )}

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-44 bg-neutral-100/80 border border-neutral-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {meta && meta.totalPages && meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10 mb-6">
                {page > 1 ? (
                  <Link href={`/search?q=${encodeURIComponent(activeQuery)}&page=${page - 1}`}>
                    <Button variant="outline" size="sm" className="rounded px-5 text-xs font-bold">Previous</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="rounded px-5 text-xs font-bold opacity-50 cursor-not-allowed" disabled>Previous</Button>
                )}
                
                <span className="text-xs font-mono font-semibold text-neutral-700 bg-neutral-100 px-4 py-1.5 rounded border border-neutral-200">
                  Page {page} of {meta.totalPages}
                </span>

                {page < meta.totalPages ? (
                  <Link href={`/search?q=${encodeURIComponent(activeQuery)}&page=${page + 1}`}>
                    <Button variant="outline" size="sm" className="rounded px-5 text-xs font-bold">Next</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="rounded px-5 text-xs font-bold opacity-50 cursor-not-allowed" disabled>Next</Button>
                )}
              </div>
            )}
          </div>
        ) : activeQuery ? (
          <div className="text-center py-16 bg-neutral-50 border border-neutral-200 rounded-lg">
            <p className="text-neutral-600 text-xs font-medium">
              No matching dispatches found for &quot;{activeQuery}&quot;.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

