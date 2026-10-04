import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Loader2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookmarkApi } from '../api/bookmarkApi';
import Avatar from '../components/Avatar';

export default function BookmarksPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => bookmarkApi.getAll(0, 50),
  });

  const bookmarks = data?.data?.data?.content || [];

  const removeMutation = useMutation({
    mutationFn: (postId) => bookmarkApi.remove(postId),
    onSuccess: () => {
      toast.success('Bookmark removed');
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5 max-w-3xl mx-auto"
    >
      <div>
        <h1 className="font-display text-3xl font-bold gradient-text">Saved Posts</h1>
        <p className="text-ink-muted mt-1 text-sm">
          {bookmarks.length} {bookmarks.length === 1 ? 'post' : 'posts'} saved
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-surface-100/60 border border-white/5 rounded-2xl p-12 text-center">
          <Bookmark className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <h3 className="font-display text-lg font-bold mb-2">No saved posts</h3>
          <p className="text-ink-muted text-sm">
            Tap the Save button on any post to bookmark it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {bookmarks.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.03 }}
                className="group bg-surface-100/60 border border-white/5 rounded-2xl p-4 hover:border-primary-500/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    user={{ id: b.post?.community?.id, username: b.post?.community?.name }}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-ink-subtle mb-1 flex-wrap">
                      <Link
                        to={`/c/${b.post?.community?.name}`}
                        className="font-semibold text-ink hover:text-primary-400 transition-colors"
                      >
                        c/{b.post?.community?.name}
                      </Link>
                      <span>•</span>
                      <span>by u/{b.post?.author?.username}</span>
                      <span>•</span>
                      <span>
                        {b.savedAt
                          ? `saved ${formatDistanceToNow(new Date(b.savedAt), { addSuffix: true })}`
                          : ''}
                      </span>
                    </div>
                    <Link to={`/post/${b.post?.id}`}>
                      <h3 className="font-bold text-ink hover:text-primary-400 transition-colors">
                        {b.post?.title}
                      </h3>
                    </Link>
                    {b.post?.content && (
                      <p className="text-sm text-ink-muted mt-1 line-clamp-2">
                        {b.post.content}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeMutation.mutate(b.post.id)}
                    className="p-2 rounded-lg text-ink-subtle hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}