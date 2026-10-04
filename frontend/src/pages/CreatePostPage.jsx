import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Type, AlignLeft, Image as ImageIcon, Hash, Layers, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { postApi } from '../api/postApi';
import { communityApi } from '../api/communityApi';
import Button from '../components/Button';

const POST_TYPES = [
  { value: 'TEXT', label: 'Text' },
  { value: 'LINK', label: 'Link' },
  { value: 'IMAGE', label: 'Image' },
];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    postType: 'TEXT',
    communityId: '',
    tagsInput: '',
  });

  const { data: communitiesData, isLoading: loadingCommunities } = useQuery({
    queryKey: ['communities', 'all'],
    queryFn: () => communityApi.getAll(0, 100),
  });

  const communities = communitiesData?.data?.data?.content || [];

  const createMutation = useMutation({
    mutationFn: (payload) => postApi.create(payload),
    onSuccess: () => {
      toast.success('Post created!');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create post');
    },
  });

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.communityId) return toast.error('Please choose a community');

    const tags = form.tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    createMutation.mutate({
      title: form.title,
      content: form.content,
      imageUrl: form.imageUrl || null,
      postType: form.postType,
      communityId: Number(form.communityId),
      tags,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold gradient-text">
          Create a Post
        </h1>
        <p className="text-ink-muted mt-1 text-sm">
          Share something with the community.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface-100/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6 space-y-5 shadow-card"
      >
        {/* Community selector */}
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-2 ml-1">
            Community
          </label>
          {loadingCommunities ? (
            <div className="flex items-center gap-2 text-ink-muted text-sm py-3">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading communities...
            </div>
          ) : communities.length === 0 ? (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-3 rounded-xl text-sm">
              No communities yet.{' '}
              <button
                type="button"
                onClick={() => navigate('/communities')}
                className="underline font-medium"
              >
                Create one first
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {communities.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleChange('communityId', c.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all text-left truncate ${
                    Number(form.communityId) === c.id
                      ? 'bg-primary-500/20 border-primary-500/50 text-primary-300 shadow-glow'
                      : 'bg-surface-50 border-white/5 text-ink-muted hover:bg-surface-100 hover:text-ink'
                  }`}
                >
                  c/{c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Post type */}
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-2 ml-1">
            Post Type
          </label>
          <div className="flex gap-2">
            {POST_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => handleChange('postType', t.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  form.postType === t.value
                    ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                    : 'bg-surface-50 border-white/5 text-ink-muted hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-2 ml-1">
            Title
          </label>
          <div className="relative">
            <Type className="absolute left-3.5 top-3.5 w-4 h-4 text-ink-subtle" />
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="An interesting title..."
              maxLength={300}
              className="w-full bg-surface-50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder-ink-subtle focus:border-primary-500/50 focus:bg-surface-100 transition-all"
            />
          </div>
          <p className="text-right text-[11px] text-ink-subtle mt-1">
            {form.title.length}/300
          </p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-2 ml-1">
            Content
          </label>
          <div className="relative">
            <AlignLeft className="absolute left-3.5 top-3.5 w-4 h-4 text-ink-subtle" />
            <textarea
              value={form.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Share your thoughts..."
              rows={8}
              className="w-full bg-surface-50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder-ink-subtle focus:border-primary-500/50 focus:bg-surface-100 transition-all resize-none"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-2 ml-1">
            Image URL (optional)
          </label>
          <div className="relative">
            <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-surface-50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder-ink-subtle focus:border-primary-500/50 focus:bg-surface-100 transition-all"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-2 ml-1">
            Tags (comma-separated)
          </label>
          <div className="relative">
            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            <input
              type="text"
              value={form.tagsInput}
              onChange={(e) => handleChange('tagsInput', e.target.value)}
              placeholder="java, springboot, jwt"
              className="w-full bg-surface-50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder-ink-subtle focus:border-primary-500/50 focus:bg-surface-100 transition-all"
            />
          </div>
          {form.tagsInput && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.tagsInput
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
                .map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-primary-500/10 text-primary-300 border border-primary-500/20"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          <Button type="submit" loading={createMutation.isPending} size="lg">
            {createMutation.isPending ? 'Publishing...' : 'Publish Post'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}