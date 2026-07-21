'use client';

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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500 border-r-2 border-transparent" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="text-center py-16 bg-gray-900/40 border border-gray-800 rounded-xl p-8 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-gray-100">Post Not Found</h2>
        <p className="text-sm text-gray-400 mt-2">
          {error ? (error as Error).message : 'This post may have been removed or flagged.'}
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
