'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Flag, Send } from 'lucide-react';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { ReportModal } from '../report/ReportModal';
import { fetchApi } from '@/lib/api';
import { Comment, COMMENT_LIMITS } from '@shodasha/shared';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [commentText, setCommentText] = useState('');
  const [reportCommentId, setReportCommentId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const res = await fetchApi<Comment[]>(`/api/v1/posts/${postId}/comments`);
      return res.data || [];
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (body: string) => {
      const res = await fetchApi<Comment>(`/api/v1/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      });
      return res.data;
    },
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    commentMutation.mutate(commentText.trim());
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      <h3 className="text-lg font-bold text-gray-100 border-b border-gray-800 pb-3">
        Comments ({comments?.length || 0})
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-gray-900/60 border border-gray-800 p-4 rounded-xl">
        {/* Honeypot field */}
        <input type="text" name="website_url" className="hidden" tabIndex={-1} autoComplete="off" />

        <Textarea
          placeholder="Share your thoughts on this discussion... (plain text only, max 300 chars)"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          maxLength={COMMENT_LIMITS.BODY_MAX_LENGTH}
          currentLength={commentText.length}
          rows={3}
        />

        {commentMutation.isError && (
          <p className="text-xs text-red-400 font-medium">
            {(commentMutation.error as Error).message}
          </p>
        )}

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Plain text only. Keep it respectful and civil.</span>
          <Button
            type="submit"
            isLoading={commentMutation.isPending}
            disabled={!commentText.trim() || commentText.length > COMMENT_LIMITS.BODY_MAX_LENGTH}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            Comment
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 border-r-2 border-transparent"></div>
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-900/40 border border-gray-800/80 rounded-lg p-4 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span className="font-semibold text-gray-300">Community Member</span>
                <div className="flex items-center gap-3">
                  <span>
                    {new Date(comment.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <button
                    onClick={() => setReportCommentId(comment.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Report comment"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line break-words">
                {comment.body}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-6">
          No comments yet. Be the first to share your perspective.
        </p>
      )}

      {reportCommentId && (
        <ReportModal
          isOpen={!!reportCommentId}
          onClose={() => setReportCommentId(null)}
          commentId={reportCommentId}
        />
      )}
    </div>
  );
};
