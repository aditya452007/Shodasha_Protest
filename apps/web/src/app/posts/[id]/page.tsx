'use client';

export const runtime = 'edge';

import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PostCard } from '@/components/post/PostCard';
import { CommentSection } from '@/components/comment/CommentSection';
import { fetchApi } from '@/lib/api';
import { Post } from '@shodasha/shared';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await fetchApi<Post>(`/api/v1/posts/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-950 border-t-transparent" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="text-center py-16 bg-neutral-50 border border-neutral-200 rounded-lg p-8 max-w-lg mx-auto">
        <h2 className="font-serif text-xl font-bold text-neutral-950">Dispatch Not Found</h2>
        <p className="text-xs text-neutral-600 mt-2 font-medium">
          {error ? (error as Error).message : 'This dispatch may have been removed or flagged for review.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <PostCard post={post} isDetail={true} />
      <CommentSection postId={post.id} />
    </div>
  );
}

