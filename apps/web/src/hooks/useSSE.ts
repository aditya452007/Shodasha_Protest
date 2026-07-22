'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SSEUpdatePayload } from '@shodasha/shared';

import { getApiBaseUrl } from '@/lib/api';

export function useSSE() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const baseUrl = getApiBaseUrl();
    const eventSource = new EventSource(`${baseUrl}/api/v1/posts/stream`, {
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
