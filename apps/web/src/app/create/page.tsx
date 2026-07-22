'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Send, AlertCircle, Info, Bold, Italic, Link as LinkIcon, Quote, Heading, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
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

const DRAFT_KEY = 'shodasha_post_draft';

export default function CreatePostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categorySlug, setCategorySlug] = useState<string>('protest-gatherings');
  const [postType, setPostType] = useState<PostType>('discussion');
  const [hasDraft, setHasDraft] = useState(false);

  // Auto-load draft check on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title || parsed.body) {
          setHasDraft(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save draft on state change
  useEffect(() => {
    if (title || body) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, body, categorySlug, postType }));
    }
  }, [title, body, categorySlug, postType]);

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.body) setBody(parsed.body);
        if (parsed.categorySlug) setCategorySlug(parsed.categorySlug);
        if (parsed.postType) setPostType(parsed.postType);
        toast('Draft restored from local storage.', 'info');
      }
    } catch {
      // ignore
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
  };

  // Formatting helpers
  const applyFormat = (prefix: string, suffix: string = '') => {
    setBody((prev) => `${prev} ${prefix}text${suffix} `.trim());
  };

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
      clearDraft();
      toast('Dispatch published successfully!', 'success');
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
    <div className="max-w-2xl mx-auto bg-white border border-neutral-200 rounded-lg p-8 shadow-md flex flex-col gap-6">
      {hasDraft && (!title && !body) && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3.5 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Saved draft found from your last session.</span>
          </div>
          <button
            onClick={loadDraft}
            className="px-3 py-1 bg-amber-950 text-white font-bold rounded text-[11px] hover:bg-amber-900 transition-colors cursor-pointer"
          >
            Restore Draft
          </button>
        </div>
      )}

      <div className="border-b border-neutral-200 pb-4">
        <span className="text-[10px] font-mono font-bold text-neutral-950 uppercase tracking-widest bg-neutral-100 px-2.5 py-1 rounded border border-neutral-300">
          Jantar Mantar Open Dispatch
        </span>
        <h1 className="font-serif font-black text-2xl md:text-3xl text-neutral-950 tracking-tight mt-3">
          Create Civic Post
        </h1>
        <p className="text-xs text-neutral-600 mt-1">
          Share your visitor observations, policy perspectives, or event dispatches regarding Jantar Mantar.
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
          <label className="block text-xs font-bold text-neutral-950 uppercase tracking-wider mb-2">
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
                  className={`p-3 rounded border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-neutral-950 border-neutral-950 text-white shadow-sm font-bold'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  <span className="text-base">{info.icon}</span>
                  <div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-neutral-950'}`}>{info.label}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-xs font-bold text-neutral-950 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full bg-white border border-neutral-300 rounded-md px-4 py-2.5 text-sm text-neutral-950 focus:outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 cursor-pointer min-h-[44px] font-medium"
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
              className={`text-xs font-mono ${
                title.length > POST_LIMITS.TITLE_MAX_LENGTH ? 'text-red-600 font-bold' : 'text-neutral-500'
              }`}
            >
              {title.length} / {POST_LIMITS.TITLE_MAX_LENGTH}
            </span>
          </div>
        </div>

        {/* Body Textarea with Formatting Toolbar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-neutral-950 uppercase tracking-wider">
              Post Body
            </label>
            <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 rounded p-0.5">
              <button
                type="button"
                onClick={() => applyFormat('**', '**')}
                className="p-1 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200 rounded transition-colors"
                title="Bold (**text**)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('*', '*')}
                className="p-1 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200 rounded transition-colors"
                title="Italic (*text*)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('> ')}
                className="p-1 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200 rounded transition-colors"
                title="Quote (> text)"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('### ')}
                className="p-1 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200 rounded transition-colors"
                title="Heading (### Header)"
              >
                <Heading className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('https://')}
                className="p-1 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200 rounded transition-colors"
                title="Insert Link"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <Textarea
            placeholder="Share your personal perspective, eyewitness report, or policy concerns (max 1500 characters, max 3 HTTPS links)..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={POST_LIMITS.BODY_MAX_LENGTH}
            currentLength={body.length}
            rows={7}
          />
          <div className="flex justify-between items-center text-xs font-mono mt-1 text-neutral-500">
            <span>Detected Links: {detectedUrls.length} / 3</span>
            {invalidUrls.length > 0 && (
              <span className="text-red-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Only https:// links allowed!
              </span>
            )}
          </div>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-md flex items-start gap-3 text-xs text-neutral-700">
          <Info className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Please keep discussions respectful and civil. Clearly present personal perspectives as opinions, and eyewitness accounts as observed events. Spam, harassment, and illegal content are strictly moderated.
          </p>
        </div>

        {createPostMutation.isError && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {(createPostMutation.error as Error).message}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="text-xs font-bold"
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
            className="gap-2 bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-bold px-5"
          >
            <Send className="w-4 h-4" />
            Publish Discussion
          </Button>
        </div>
      </form>
    </div>
  );
}


