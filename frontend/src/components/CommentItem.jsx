import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowBigUp, ArrowBigDown, Reply, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import Avatar from './Avatar';
import { cn } from '../utils/cn';
import { voteApi } from '../api/voteApi';
import { commentApi } from '../api/commentApi';
import useAuthStore from '../store/authStore';

export default function CommentItem({ comment, onReply, depth = 0 }) {
  const { user, isAuthenticated } = useAuthStore();
  const [vote, setVote] = useState(0);
  const [voteCount, setVoteCount] = useState(comment.voteCount || 0);
  const [voting, setVoting] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const isOwner = user?.username === comment.author?.username;
  const maxDepth = 5;

  const handleVote = async (type) => {
    if (!isAuthenticated) return toast.error('Please log in to vote');
    if (voting) return;
    setVoting(true);

    const voteType = type === 1 ? 'UPVOTE' : 'DOWNVOTE';
    const previousVote = vote;
    const previousCount = voteCount;

    let newVote;
    if (vote === type) {
      newVote = 0;
      setVoteCount((c) => c + (type === 1 ? -1 : 1));
    } else {
      const delta = vote === 0 ? type : type - vote;
      newVote = type;
      setVoteCount((c) => c + delta);
    }
    setVote(newVote);

    try {
      const res = await voteApi.voteComment(comment.id, voteType);
      const serverData = res.data?.data;
      if (serverData) {
        setVoteCount(serverData.newVoteCount ?? voteCount);
        setVote(serverData.voteType === 'REMOVED' ? 0 : serverData.voteType === 'UPVOTE' ? 1 : -1);
      }
    } catch (error) {
      setVote(previousVote);
      setVoteCount(previousCount);
      toast.error('Vote failed');
    } finally {
      setVoting(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await commentApi.create({
        content: replyText.trim(),
        postId: comment.postId,
        parentCommentId: comment.id,
      });
      toast.success('Reply added');
      setReplyText('');
      setReplying(false);
      onReply?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    try {
      await commentApi.delete(comment.id);
      setDeleted(true);
      toast.success('Comment deleted');
      onReply?.();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (deleted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(depth > 0 && 'ml-6 border-l-2 border-white/5 pl-4')}
    >
      <div className="py-3">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs text-ink-subtle mb-2">
          <Avatar user={comment.author} size="xs" />
          <Link to={`/u/${comment.author?.username}`} className="font-semibold text-ink hover:text-primary-400 transition-colors">
            u/{comment.author?.username}
          </Link>
          <span>•</span>
          <span>{comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ''}</span>
        </div>

        {/* Content */}
        <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-1 mt-2 text-xs">
          <button
            onClick={() => handleVote(1)}
            disabled={voting}
            className={cn('flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50', vote === 1 && 'text-primary-400 bg-primary-500/10')}
          >
            <ArrowBigUp className="w-4 h-4" fill={vote === 1 ? 'currentColor' : 'none'} />
            <span className={cn('font-bold', vote === 1 ? 'text-primary-400' : vote === -1 ? 'text-red-400' : '')}>
              {voteCount}
            </span>
          </button>
          <button
            onClick={() => handleVote(-1)}
            disabled={voting}
            className={cn('p-1 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50', vote === -1 && 'text-red-400 bg-red-500/10')}
          >
            <ArrowBigDown className="w-4 h-4" fill={vote === -1 ? 'currentColor' : 'none'} />
          </button>
          {isAuthenticated && depth < maxDepth && (
            <button
              onClick={() => setReplying((v) => !v)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Reply className="w-3.5 h-3.5" />
              Reply
            </button>
          )}
          {isOwner && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>

        {/* Reply form */}
        {replying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 flex flex-col gap-2"
          >
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={3}
              className="w-full bg-surface-50 border border-white/5 rounded-xl px-3 py-2 text-sm text-ink placeholder-ink-subtle focus:border-primary-500/50 transition-all resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleReply}
                disabled={submitting || !replyText.trim()}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium hover:from-primary-500 hover:to-primary-600 disabled:opacity-50 transition-all"
              >
                {submitting ? 'Posting...' : 'Reply'}
              </button>
              <button
                onClick={() => { setReplying(false); setReplyText(''); }}
                className="px-4 py-1.5 rounded-full text-ink-muted text-sm hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies((v) => !v)}
                className="text-xs text-primary-400 hover:text-primary-300 font-medium mb-2"
              >
                {showReplies ? '− Hide replies' : `+ Show ${comment.replies.length} replies`}
              </button>
            )}
            {showReplies && comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}