'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Send, AlertCircle, Info } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/api';
import {
  CATEGORIES,
  Category,
  POST_LIMITS,
  Post,
  POST_TYPES,
  POST_TYPE_LABELS,
  PostType,
} from '@shodasha/shared';

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categorySlug, setCategorySlug] = useState<string>('protest-gatherings');
  const [postType, setPostType] = useState<PostType>('discussion');

  // Fetch category list from server
  const { data: serverCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetchApi<Category[]>('/api/v1/categories');
      return res.data || [];
    },
  });

  const categoryList = serverCategories && serverCategories.length > 0 ? serverCategories : CATEGORIES;

  const createPostMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchApi<Post>('/api/v1/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          categorySlug,
          postType,
        }),
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.id) {
        router.push(`/posts/${data.id}`);
      } else {
        router.push('/');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    createPostMutation.mutate();
  };

  // Link analysis for client feedback
  const detectedUrls = body.match(/(https?:\/\/[^\s<]+)/gi) || [];
  const invalidUrls = detectedUrls.filter((u) => !u.toLowerCase().startsWith('https://'));

  return (
    <div className="max-w-2xl mx-auto bg-gray-900/90 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
      <div className="border-b border-gray-800 pb-4">
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
          Jantar Mantar Community Forum
        </span>
        <h1 className="text-2xl font-black text-gray-100 tracking-tight mt-2">
          Create Civic Post
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Share your visitor observations, policy perspectives, or event updates regarding Jantar Mantar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Honeypot field for anti-bot protection */}
        <input
          type="text"
          name="website_url"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Post Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Select Perspective / Post Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {POST_TYPES.map((type) => {
              const info = POST_TYPE_LABELS[type];
              const isSelected = postType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPostType(type)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                  }`}
                >
                  <span className="text-lg">{info.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-gray-100">{info.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer min-h-[44px]"
          >
            {categoryList.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name} — {cat.description}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <Input
            label="Post Title"
            placeholder="Descriptive title of your observation or discussion (max 120 chars)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={POST_LIMITS.TITLE_MAX_LENGTH}
          />
          <div className="flex justify-end mt-1">
            <span
              className={`text-xs ${
                title.length > POST_LIMITS.TITLE_MAX_LENGTH ? 'text-red-400' : 'text-gray-500'
              }`}
            >
              {title.length} / {POST_LIMITS.TITLE_MAX_LENGTH}
            </span>
          </div>
        </div>

        {/* Body */}
        <div>
          <Textarea
            label="Post Body"
            placeholder="Share your personal perspective, eyewitness report, or policy concerns (max 1500 characters, max 3 HTTPS links)..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={POST_LIMITS.BODY_MAX_LENGTH}
            currentLength={body.length}
            rows={7}
          />
          <div className="flex justify-between items-center text-xs mt-1 text-gray-400">
            <span>Detected Links: {detectedUrls.length} / 3</span>
            {invalidUrls.length > 0 && (
              <span className="text-red-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Only https:// links allowed!
              </span>
            )}
          </div>
        </div>

        <div className="bg-gray-950/80 border border-gray-800 p-4 rounded-xl flex items-start gap-3 text-xs text-gray-400">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            Please keep discussions respectful and civil. Clearly present personal perspectives as opinions, and eyewitness accounts as observed events. Spam, harassment, and illegal content are strictly moderated.
          </p>
        </div>

        {createPostMutation.isError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
            {(createPostMutation.error as Error).message}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={createPostMutation.isPending}
            disabled={
              !title.trim() ||
              title.length < POST_LIMITS.TITLE_MIN_LENGTH ||
              !body.trim() ||
              body.length < POST_LIMITS.BODY_MIN_LENGTH ||
              invalidUrls.length > 0 ||
              detectedUrls.length > 3
            }
            className="gap-2 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white"
          >
            <Send className="w-4 h-4" />
            Publish Discussion
          </Button>
        </div>
      </form>
    </div>
  );
}
