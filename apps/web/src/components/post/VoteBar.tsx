'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { useToast } from '../ui/Toast';

interface VoteBarProps {
  postId: string;
  upvotes: number;
  downvotes: number;
  netVotes: number;
  userVote?: number;
}

export const VoteBar: React.FC<VoteBarProps> = ({
  postId,
  netVotes: initialNetVotes,
  userVote: initialUserVote = 0,
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [localNetVotes, setLocalNetVotes] = useState(initialNetVotes);
  const [localUserVote, setLocalUserVote] = useState(initialUserVote);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with incoming props when server refetches
  useEffect(() => {
    setLocalNetVotes(initialNetVotes);
    setLocalUserVote(initialUserVote);
  }, [initialNetVotes, initialUserVote]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const dispatchVoteApi = useCallback(
    async (targetVoteValue: 1 | -1 | 0) => {
      try {
        const res = await fetchApi<{
          postId: string;
          upvotes: number;
          downvotes: number;
          netVotes: number;
          userVote: number;
        }>(`/api/v1/posts/${postId}/vote`, {
          method: 'POST',
          body: JSON.stringify({ voteValue: targetVoteValue }),
        });

        if (res.data) {
          setLocalNetVotes(res.data.netVotes);
          setLocalUserVote(res.data.userVote);
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          queryClient.invalidateQueries({ queryKey: ['post', postId] });
        }
      } catch (err) {
        // Rollback on failure
        setLocalNetVotes(initialNetVotes);
        setLocalUserVote(initialUserVote);
        toast('Failed to record vote. Please try again.', 'error');
      }
    },
    [postId, initialNetVotes, initialUserVote, queryClient, toast]
  );

  const handleVoteClick = (targetType: 'up' | 'down') => {
    let nextUserVote: number;
    let voteDiff: number;

    if (targetType === 'up') {
      if (localUserVote === 1) {
        // Toggle off
        nextUserVote = 0;
        voteDiff = -1;
      } else if (localUserVote === -1) {
        // Switch from downvote to upvote
        nextUserVote = 1;
        voteDiff = 2;
      } else {
        // Upvote from 0
        nextUserVote = 1;
        voteDiff = 1;
      }
    } else {
      if (localUserVote === -1) {
        // Toggle off
        nextUserVote = 0;
        voteDiff = 1;
      } else if (localUserVote === 1) {
        // Switch from upvote to downvote
        nextUserVote = -1;
        voteDiff = -2;
      } else {
        // Downvote from 0
        nextUserVote = -1;
        voteDiff = -1;
      }
    }

    // 1. Optimistic instant UI update (0ms latency)
    setLocalUserVote(nextUserVote);
    setLocalNetVotes((prev) => prev + voteDiff);

    // 2. Debounce Network Sync (600ms delay)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      dispatchVoteApi(nextUserVote as 1 | -1 | 0);
    }, 600);
  };

  const isUpvoted = localUserVote === 1;
  const isDownvoted = localUserVote === -1;

  return (
    <div className="inline-flex items-center gap-1 bg-neutral-100/90 border border-neutral-200 rounded p-1">
      <button
        onClick={() => handleVoteClick('up')}
        className={`p-1.5 rounded transition-colors cursor-pointer min-w-[32px] flex items-center justify-center ${
          isUpvoted
            ? 'text-white bg-neutral-950 font-bold shadow-sm'
            : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/80'
        }`}
        aria-label="Upvote dispatch"
        title="Upvote dispatch"
      >
        <ArrowBigUp className={`w-4 h-4 ${isUpvoted ? 'fill-white' : ''}`} />
      </button>

      <span
        className={`text-xs font-mono font-bold px-1.5 min-w-[28px] text-center ${
          localNetVotes > 0
            ? 'text-neutral-950'
            : localNetVotes < 0
            ? 'text-red-600'
            : 'text-neutral-600'
        }`}
      >
        {localNetVotes > 0 ? `+${localNetVotes}` : localNetVotes}
      </span>

      <button
        onClick={() => handleVoteClick('down')}
        className={`p-1.5 rounded transition-colors cursor-pointer min-w-[32px] flex items-center justify-center ${
          isDownvoted
            ? 'text-red-900 bg-red-100 border border-red-200 font-bold'
            : 'text-neutral-600 hover:text-red-600 hover:bg-neutral-200/80'
        }`}
        aria-label="Downvote dispatch"
        title="Downvote dispatch"
      >
        <ArrowBigDown className={`w-4 h-4 ${isDownvoted ? 'fill-red-600' : ''}`} />
      </button>
    </div>
  );
};


