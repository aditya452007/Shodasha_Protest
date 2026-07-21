'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PostCard } from '@/components/post/PostCard';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/api';
import { Post } from '@shodasha/shared';

export default function LatestPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'latest', page],
    queryFn: async () => {
      const res = await fetchApi<Post[]>(
        `/api/v1/posts?sort=latest&page=${page}&limit=20`
      );
      return res;
    },
  });

  const posts = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-gray-800 pb-3">
        <h1 className="text-2xl font-black text-gray-100 tracking-tight flex items-center gap-2">
          <span>⚡</span> Latest Jantar Mantar Posts
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Chronological stream of new eyewitness updates, visitor experiences, and public policy perspectives.
        </p>
      </div>

      <CategoryNav />

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
      ) : (
        <p className="text-sm text-gray-400 text-center py-8">No recent posts found.</p>
      )}
    </div>
  );
}
