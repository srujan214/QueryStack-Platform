import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { commentApi } from '../api/commentApi';
import CommentItem from './CommentItem';
import useAuthStore from '../store/authStore';

export default function CommentSection({ postId }) {
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentApi.getByPost(postId),
  });

  const comments = data?.data?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await commentApi.create({
        content: newComment.trim(),
        postId: Number(postId),
        parentCommentId: null,
      });
      toast.success('Comment posted');
      setNewComment('');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-100/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary-400" />
        <h2 className="font-display text-lg font-bold">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h2>
      </div>

      {/* New comment form */}
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Comment as u/${user?.username}...`}
                rows={3}
                className="w-full bg-surface-50 border border-white/5 rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-subtle focus:border-primary-500/50 focus:bg-surface-100 transition-all resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium hover:from-primary-500 hover:to-primary-600 disabled:opacity-50 transition-all"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}

      {/* Comments list */}
      <div className="divide-y divide-white/5">
        {isLoading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        ) : comments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-10 text-center text-ink-muted text-sm"
          >
            No comments yet. Be the first to share your thoughts!
          </motion.div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={refetch}
              depth={0}
            />
          ))
        )}
      </div>
    </div>
  );
}