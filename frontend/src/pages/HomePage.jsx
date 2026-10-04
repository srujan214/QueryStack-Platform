import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';
import { useState } from 'react';
import { postApi } from '../api/postApi';
import PostCard from '../components/PostCard';
import Spinner from '../components/Spinner';
import useAuthStore from '../store/authStore';

const tabs = [
  { id: 'recent', label: 'Latest', icon: Clock },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
];

export default function HomePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('recent');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts', activeTab],
    queryFn: () =>
      activeTab === 'recent'
        ? postApi.getRecent(0, 20)
        : postApi.getTrending(0, 20),
  });

  const posts = data?.data?.data?.content || [];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-3xl font-bold">
          Welcome back,{' '}
          <span className="gradient-text">
            {user?.displayName || user?.username}
          </span>
        </h1>
        <p className="text-ink-muted mt-1 text-sm">
          Here's what's happening in your communities.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-surface-100/60 backdrop-blur-sm border border-white/5 rounded-2xl p-1.5 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === id
                ? 'text-white'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {activeTab === id && (
              <motion.div
                layoutId="tab-active"
                className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-20">
          <Spinner size={48} />
          <p className="text-center text-ink-muted text-sm mt-4">
            Loading posts...
          </p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-sm">
          Failed to load posts:{' '}
          {error?.response?.data?.message || error?.message}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && posts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-100/60 border border-white/5 rounded-2xl p-12 text-center"
        >
          <Sparkles className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold text-ink mb-2">
            No posts yet
          </h3>
          <p className="text-ink-muted text-sm mb-6">
            Be the first to share something with the community!
          </p>
          <a
            href="/create-post"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium hover:from-primary-500 hover:to-primary-600 transition-all"
          >
            Create your first post
          </a>
        </motion.div>
      )}

      {/* Posts list */}
      {!isLoading && !isError && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}