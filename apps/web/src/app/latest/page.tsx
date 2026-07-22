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

// Helper to fetch data on the server
async function fetchLatestPosts(page: number) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
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
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-gray-100 tracking-tight flex items-center gap-3">
            <span className="text-emerald-400">⚡</span> Latest Jantar Mantar Posts
          </h1>
          <p className="text-[15px] text-gray-400 mt-3 max-w-2xl leading-relaxed">
            Chronological stream of new eyewitness updates, visitor experiences, and public policy perspectives.
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
              <div className="flex justify-center items-center gap-4 mt-10 mb-6">
                {page > 1 ? (
                  <Link href={`/latest?page=${page - 1}`}>
                    <Button variant="outline" size="sm" className="rounded-full px-6">Previous</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-full px-6 opacity-50 cursor-not-allowed" disabled>Previous</Button>
                )}
                
                <span className="text-sm text-gray-400 font-medium bg-gray-900/50 px-4 py-1.5 rounded-full border border-gray-800">
                  Page {page} of {meta.totalPages}
                </span>

                {page < meta.totalPages ? (
                  <Link href={`/latest?page=${page + 1}`}>
                    <Button variant="outline" size="sm" className="rounded-full px-6">Next</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-full px-6 opacity-50 cursor-not-allowed" disabled>Next</Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-900/40 border border-gray-800 rounded-2xl shadow-sm">
            <p className="text-gray-400 text-sm font-medium">No recent posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
