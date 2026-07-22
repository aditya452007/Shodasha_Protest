'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Flag, Send, MessageSquare } from 'lucide-react';
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
    <div className="flex flex-col gap-6 mt-8 pt-6 border-t border-neutral-200">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <h3 className="font-serif font-black text-lg text-neutral-950 uppercase tracking-tight flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-neutral-700" />
          Community Discussion ({comments?.length || 0})
        </h3>
        <span className="text-xs font-mono text-neutral-500">Public Comments</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white border border-neutral-200 p-5 rounded-lg shadow-sm">
        {/* Honeypot field */}
        <input type="text" name="website_url" className="hidden" tabIndex={-1} autoComplete="off" />

        <Textarea
          placeholder="Share your eyewitness perspective or discussion... (plain text only, max 300 chars)"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          maxLength={COMMENT_LIMITS.BODY_MAX_LENGTH}
          currentLength={commentText.length}
          rows={3}
        />

        {commentMutation.isError && (
          <p className="text-xs text-red-600 font-medium">
            {(commentMutation.error as Error).message}
          </p>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Keep discussions civil and focused on Jantar Mantar civic events.</span>
          <Button
            type="submit"
            isLoading={commentMutation.isPending}
            disabled={!commentText.trim() || commentText.length > COMMENT_LIMITS.BODY_MAX_LENGTH}
            className="gap-2 text-xs rounded font-bold px-4 py-2 bg-neutral-950 text-white hover:bg-neutral-800"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Comment
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-neutral-950 border-t-transparent"></div>
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white border border-neutral-200 rounded-lg p-4 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-900 font-mono uppercase tracking-wider text-[11px]">Civic Participant</span>
                <div className="flex items-center gap-3 text-neutral-500 font-mono">
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
                    className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Report comment"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-line break-words font-sans">
                {comment.body}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-neutral-50 border border-neutral-200 rounded-lg">
          <p className="text-xs text-neutral-500 font-medium">
            No dispatches yet. Be the first to join the public discussion.
          </p>
        </div>
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

