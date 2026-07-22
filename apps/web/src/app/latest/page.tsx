import React from 'react';
import Link from 'next/link';
import { PostCard } from '@/components/post/PostCard';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { Button } from '@/components/ui/Button';
import { Post } from '@shodasha/shared';
import { Metadata } from 'next';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Latest Updates | Shodasha Civic Forum',
  description: 'Chronological stream of new eyewitness updates, visitor experiences, and public policy perspectives from Jantar Mantar.',
};

import { getApiBaseUrl } from '@/lib/api';

// Helper to fetch data on the server
async function fetchLatestPosts(page: number) {
  try {
    const apiUrl = getApiBaseUrl();
    const res = await fetch(`${apiUrl}/api/v1/posts?sort=latest&page=${page}&limit=20`, {
      next: { revalidate: 30 }
    });
    if (!res.ok) {
      return { data: [], meta: { page: 1, totalPages: 1 } };
    }
    return res.json();
  } catch (err) {
    console.error('Server-side fetch latest posts failed:', err);
    return { data: [], meta: { page: 1, totalPages: 1 } };
  }
}

export default async function LatestPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;

  const data = await fetchLatestPosts(page);
  const posts: Post[] = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-white border-2 border-neutral-950 rounded-lg p-8 shadow-sm">
        <div className="max-w-2xl">
          <span className="text-[10px] font-mono font-bold text-neutral-950 uppercase tracking-widest bg-neutral-100 px-2.5 py-1 rounded border border-neutral-300">
            Chronological Stream
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-black text-neutral-950 tracking-tight mt-3">
            Latest Eyewitness Dispatches
          </h1>
          <p className="text-xs md:text-sm text-neutral-700 mt-2 leading-relaxed font-sans">
            Chronological stream of real-time eyewitness updates, visitor accounts, and peaceful rally dispatches.
          </p>
        </div>
      </div>

      <CategoryNav />

      <div className="min-h-[500px]">
        {posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {meta && meta.totalPages && meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10 mb-6">
                {page > 1 ? (
                  <Link href={`/latest?page=${page - 1}`}>
                    <Button variant="outline" size="sm" className="rounded px-5 text-xs font-bold">Previous</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="rounded px-5 text-xs font-bold opacity-50 cursor-not-allowed" disabled>Previous</Button>
                )}
                
                <span className="text-xs font-mono font-semibold text-neutral-700 bg-neutral-100 px-4 py-1.5 rounded border border-neutral-200">
                  Page {page} of {meta.totalPages}
                </span>

                {page < meta.totalPages ? (
                  <Link href={`/latest?page=${page + 1}`}>
                    <Button variant="outline" size="sm" className="rounded px-5 text-xs font-bold">Next</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="rounded px-5 text-xs font-bold opacity-50 cursor-not-allowed" disabled>Next</Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-neutral-50 border border-neutral-200 rounded-lg">
            <p className="text-neutral-600 text-xs font-medium">No recent dispatches found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

