'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface VoteBarProps {
  postId: string;
  upvotes: number;
  downvotes: number;
  netVotes: number;
  userVote?: number;
}

export const VoteBar: React.FC<VoteBarProps> = ({
  postId,
  netVotes,
  userVote = 0,
}) => {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async (voteValue: 1 | -1) => {
      const res = await fetchApi<{
        postId: string;
        upvotes: number;
        downvotes: number;
        netVotes: number;
        userVote: number;
      }>(`/api/v1/posts/${postId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ voteValue }),
      });
      return res.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  const isUpvoted = userVote === 1;
  const isDownvoted = userVote === -1;

  return (
    <div className="inline-flex items-center gap-1 bg-gray-900/90 border border-gray-800 rounded-lg p-1">
      <button
        onClick={() => voteMutation.mutate(1)}
        disabled={voteMutation.isPending}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          isUpvoted
            ? 'text-orange-500 bg-orange-500/10'
            : 'text-gray-400 hover:text-orange-400 hover:bg-gray-800'
        }`}
        aria-label="Upvote"
      >
        <ArrowBigUp className={`w-5 h-5 ${isUpvoted ? 'fill-orange-500' : ''}`} />
      </button>

      <span
        className={`text-xs font-bold px-1.5 ${
          netVotes > 0
            ? 'text-orange-400'
            : netVotes < 0
            ? 'text-red-400'
            : 'text-gray-300'
        }`}
      >
        {netVotes}
      </span>

      <button
        onClick={() => voteMutation.mutate(-1)}
        disabled={voteMutation.isPending}
        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
          isDownvoted
            ? 'text-red-500 bg-red-500/10'
            : 'text-gray-400 hover:text-red-400 hover:bg-gray-800'
        }`}
        aria-label="Downvote"
      >
        <ArrowBigDown className={`w-5 h-5 ${isDownvoted ? 'fill-red-500' : ''}`} />
      </button>
    </div>
  );
};
