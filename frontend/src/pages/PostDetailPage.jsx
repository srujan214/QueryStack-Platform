import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { postApi } from '../api/postApi';
import Spinner from '../components/Spinner';
import PostCard from '../components/PostCard';
import CommentSection from '../components/CommentSection';

export default function PostDetailPage() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postApi.getById(id),
  });

  const post = data?.data?.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to feed
      </Link>

      {isLoading && (
        <div className="py-20 flex justify-center">
          <Spinner size={48} />
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-sm">
          Failed to load post.
        </div>
      )}

      {post && (
        <>
          <PostCard post={post} index={0} />
          <CommentSection postId={id} />
        </>
      )}
    </motion.div>
  );
}