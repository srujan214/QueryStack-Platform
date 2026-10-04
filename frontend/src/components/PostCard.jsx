import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Avatar from './Avatar';
import { cn } from '../utils/cn';
import { voteApi } from '../api/voteApi';
import { bookmarkApi } from '../api/bookmarkApi';
import useAuthStore from '../store/authStore';

export default function PostCard({ post, index = 0 }) {
  const { isAuthenticated } = useAuthStore();
  const [vote, setVote] = useState(0);
  const [voteCount, setVoteCount] = useState(post.voteCount || 0);
  const [saved, setSaved] = useState(false);
  const [voting, setVoting] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    setVoteCount(post.voteCount || 0);
    if (isAuthenticated) {
      voteApi.getPostVote(post.id).then((res) => {
        setVote(res.data?.data || 0);
      }).catch(() => {});
      bookmarkApi.check(post.id).then((res) => {
        setSaved(res.data?.data || false);
      }).catch(() => {});
    }
  }, [post.id, post.voteCount, isAuthenticated]);

  const handleVote = async (type) => {
    if (!isAuthenticated) return toast.error('Please log in to vote');
    if (voting) return;
    setVoting(true);

    const voteType = type === 1 ? 'UPVOTE' : 'DOWNVOTE';
    const previousVote = vote;
    const previousCount = voteCount;

    // Optimistic UI
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
      const res = await voteApi.votePost(post.id, voteType);
      const serverData = res.data?.data;
      if (serverData) {
        setVoteCount(serverData.newVoteCount ?? voteCount);
        if (serverData.voteType === 'REMOVED') {
          setVote(0);
        } else {
          setVote(serverData.voteType === 'UPVOTE' ? 1 : -1);
        }
      }
    } catch (error) {
      // Rollback
      setVote(previousVote);
      setVoteCount(previousCount);
      toast.error(error.response?.data?.message || 'Vote failed');
    } finally {
      setVoting(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return toast.error('Please log in to save posts');
    if (bookmarking) return;
    setBookmarking(true);

    try {
      if (saved) {
        await bookmarkApi.remove(post.id);
        setSaved(false);
        toast.success('Removed from saved');
      } else {
        await bookmarkApi.save(post.id);
        setSaved(true);
        toast.success('Saved to bookmarks');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="bg-surface-100/80 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-primary-500/20 transition-all duration-300"
    >
      <div className="flex">
        <div className="flex flex-col items-center gap-1 p-2 bg-surface-50/50 min-w-[52px]">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => handleVote(1)}
            disabled={voting}
            className={cn(
              'p-1.5 rounded-lg transition-colors disabled:opacity-50',
              vote === 1 ? 'text-primary-400 bg-primary-500/10' : 'text-ink-subtle hover:bg-white/5 hover:text-primary-400'
            )}
          >
            <ArrowBigUp className="w-5 h-5" fill={vote === 1 ? 'currentColor' : 'none'} />
          </motion.button>
          <span className={cn('text-xs font-bold', vote === 1 ? 'text-primary-400' : vote === -1 ? 'text-red-400' : 'text-ink-muted')}>
            {voteCount}
          </span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => handleVote(-1)}
            disabled={voting}
            className={cn(
              'p-1.5 rounded-lg transition-colors disabled:opacity-50',
              vote === -1 ? 'text-red-400 bg-red-500/10' : 'text-ink-subtle hover:bg-white/5 hover:text-red-400'
            )}
          >
            <ArrowBigDown className="w-5 h-5" fill={vote === -1 ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-center gap-2 text-xs text-ink-subtle mb-2 flex-wrap">
            <Link to={`/c/${post.community?.name}`} className="flex items-center gap-1.5 font-semibold text-ink hover:text-primary-400 transition-colors">
              <Avatar user={{ id: post.community?.id, username: post.community?.name }} size="xs" />
              c/{post.community?.name}
            </Link>
            <span>•</span>
            <span>Posted by</span>
            <Link to={`/u/${post.author?.username}`} className="hover:text-primary-400 transition-colors">
              u/{post.author?.username}
            </Link>
            <span>•</span>
            <span>{post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ''}</span>
          </div>

          <Link to={`/post/${post.id}`} className="block group">
            <h2 className="text-lg font-bold text-ink group-hover:text-primary-400 transition-colors">
              {post.title}
            </h2>
            {post.content && (
              <p className="text-sm text-ink-muted mt-1.5 line-clamp-2 leading-relaxed">
                {post.content}
              </p>
            )}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="rounded-xl mt-3 max-h-96 w-full object-cover border border-white/5"
              />
            )}
          </Link>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-primary-500/10 text-primary-300 border border-primary-500/20">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 mt-3 text-xs text-ink-muted">
            <Link to={`/post/${post.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <MessageSquare className="w-4 h-4" />
              {post.commentCount || 0} Comments
            </Link>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handleSave}
              disabled={bookmarking}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors ml-auto disabled:opacity-50', saved && 'text-primary-400')}
            >
              <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}