import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Flame, Loader2 } from 'lucide-react';
import { postApi } from '../api/postApi';
import PostCard from '../components/PostCard';

export default function PopularPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'popular'],
    queryFn: () => postApi.getTrending(0, 20),
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
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-glow">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold gradient-text">Popular</h1>
          <p className="text-ink-muted text-sm mt-0.5">
            The hottest posts on QueryStack right now.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-surface-100/60 border border-white/5 rounded-2xl p-12 text-center">
          <Flame className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <p className="text-ink-muted text-sm">No popular posts yet.</p>
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