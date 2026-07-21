'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SSEUpdatePayload } from '@shodasha/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function useSSE() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/api/v1/posts/stream`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const payload: SSEUpdatePayload = JSON.parse(event.data);
        if (payload.type === 'post_created' || payload.type === 'vote_updated') {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          if (payload.postId) {
            queryClient.invalidateQueries({ queryKey: ['post', payload.postId] });
          }
        } else if (payload.type === 'comment_added') {
          if (payload.postId) {
            queryClient.invalidateQueries({ queryKey: ['comments', payload.postId] });
            queryClient.invalidateQueries({ queryKey: ['post', payload.postId] });
          }
        }
      } catch (err) {
        console.error('Failed to parse SSE payload:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('SSE connection error:', err);
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);
}
