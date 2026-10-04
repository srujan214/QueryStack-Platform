import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Award, MessageSquare } from 'lucide-react';
import { userApi } from '../api/userApi';
import { postApi } from '../api/postApi';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import Spinner from '../components/Spinner';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { username } = useParams();

  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ['user', username],
    queryFn: () => userApi.getUserByUsername(username),
  });

  const { data: postsData, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts', 'author', username],
    queryFn: () => postApi.getByAuthor(username, 0, 20),
  });

  const user = userData?.data?.data;
  const posts = postsData?.data?.data?.content || [];

  if (loadingUser) {
    return <div className="py-20 flex justify-center"><Spinner size={48} /></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header card */}
      <div className="relative overflow-hidden bg-surface-100/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6 shadow-card">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-purple-500/10 to-transparent" />
        <div className="relative flex items-center gap-5">
          <Avatar user={user} size="xl" />
          <div>
            <h1 className="font-display text-2xl font-bold">
              {user?.displayName || user?.username}
            </h1>
            <p className="text-ink-muted text-sm">@{user?.username}</p>
            {user?.bio && <p className="text-ink-muted text-sm mt-2 max-w-lg">{user.bio}</p>}
            <div className="flex items-center gap-4 mt-3 text-xs text-ink-subtle">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> {user?.karmaPoints || 0} karma
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> {posts.length} posts
              </span>
              {user?.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {format(new Date(user.createdAt), 'MMM yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="font-display text-lg font-bold mb-3">Posts</h2>
        {loadingPosts ? (
          <div className="py-10 flex justify-center"><Spinner /></div>
        ) : posts.length === 0 ? (
          <div className="bg-surface-100/60 border border-white/5 rounded-2xl p-10 text-center text-ink-muted text-sm">
            No posts yet.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((p, i) => (
              <PostCard key={p.id} post={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}