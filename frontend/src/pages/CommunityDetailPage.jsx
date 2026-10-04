import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Calendar, ArrowLeft, Check, Plus } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { communityApi } from '../api/communityApi';
import { postApi } from '../api/postApi';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import Spinner from '../components/Spinner';
import Button from '../components/Button';

export default function CommunityDetailPage() {
  const { name } = useParams();
  const queryClient = useQueryClient();

  const { data: communityData, isLoading: loadingCommunity } = useQuery({
    queryKey: ['community', name],
    queryFn: () => communityApi.getByName(name),
  });

  const community = communityData?.data?.data;

  const { data: postsData, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts', 'community', community?.id],
    queryFn: () => postApi.getByCommunity(community.id, 0, 20),
    enabled: !!community?.id,
  });

  const posts = postsData?.data?.data?.content || [];

  const joinMutation = useMutation({
    mutationFn: () => communityApi.join(community.id),
    onSuccess: () => {
      toast.success('Joined community!');
      queryClient.invalidateQueries({ queryKey: ['community', name] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  if (loadingCommunity) {
    return <div className="py-20 flex justify-center"><Spinner size={48} /></div>;
  }

  if (!community) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl">
        Community not found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <Link
        to="/communities"
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All communities
      </Link>

      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 shadow-card">
        <div className="h-32 bg-gradient-to-r from-primary-600/40 via-purple-500/40 to-pink-500/30" />
        <div className="bg-surface-100/80 backdrop-blur-sm p-6 pt-0">
          <div className="flex items-end gap-4 -mt-8">
            <Avatar user={{ id: community.id, username: community.name }} size="xl" className="border-4 border-surface-100" />
            <div className="flex-1 pb-2">
              <h1 className="font-display text-2xl font-bold">
                c/{community.name}
              </h1>
              <div className="flex items-center gap-3 mt-1 text-xs text-ink-subtle">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {community.memberCount || 0} members
                </span>
                {community.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Created {format(new Date(community.createdAt), 'MMM yyyy')}
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={() => joinMutation.mutate()}
              loading={joinMutation.isPending}
              variant="primary"
            >
              <Plus className="w-4 h-4" />
              Join
            </Button>
          </div>

          {community.description && (
            <p className="text-sm text-ink-muted mt-4 max-w-2xl">
              {community.description}
            </p>
          )}
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="font-display text-lg font-bold mb-3">Posts</h2>
        {loadingPosts ? (
          <div className="py-10 flex justify-center"><Spinner /></div>
        ) : posts.length === 0 ? (
          <div className="bg-surface-100/60 border border-white/5 rounded-2xl p-12 text-center">
            <p className="text-ink-muted text-sm">
              No posts in this community yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}