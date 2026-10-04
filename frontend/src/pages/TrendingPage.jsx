import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, Loader2 } from 'lucide-react';
import { postApi } from '../api/postApi';
import PostCard from '../components/PostCard';

export default function TrendingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'trending'],
    queryFn: () => postApi.getTrending(0, 30),
  });

  const posts = data?.data?.data?.content || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-glow">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold gradient-text">Trending</h1>
          <p className="text-ink-muted text-sm mt-0.5">
            What the community is talking about.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-surface-100/60 border border-white/5 rounded-2xl p-12 text-center">
          <TrendingUp className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <p className="text-ink-muted text-sm">Nothing trending yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
}