import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search as SearchIcon, Users, FileText, Loader2 } from 'lucide-react';
import { postApi } from '../api/postApi';
import { userApi } from '../api/userApi';
import { communityApi } from '../api/communityApi';
import PostCard from '../components/PostCard';
import Avatar from '../components/Avatar';
import { Link } from 'react-router-dom';

const tabs = [
  { id: 'posts', label: 'Posts', icon: FileText },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'communities', label: 'Communities', icon: Users },
];

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const [activeTab, setActiveTab] = useState('posts');
  const [localInput, setLocalInput] = useState(query);

  useEffect(() => setLocalInput(query), [query]);

  const { data: postsData, isLoading: loadingPosts } = useQuery({
    queryKey: ['search', 'posts', query],
    queryFn: () => postApi.search(query, 0, 20),
    enabled: !!query && activeTab === 'posts',
  });

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['search', 'users', query],
    queryFn: () => userApi.search(query, 0, 20),
    enabled: !!query && activeTab === 'users',
  });

  const { data: communitiesData, isLoading: loadingCommunities } = useQuery({
    queryKey: ['search', 'communities', query],
    queryFn: () => communityApi.search(query, 0, 20),
    enabled: !!query && activeTab === 'communities',
  });

  const posts = postsData?.data?.data?.content || [];
  const users = usersData?.data?.data?.content || [];
  const communities = communitiesData?.data?.data?.content || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <div>
        <h1 className="font-display text-3xl font-bold gradient-text">Search</h1>
        <p className="text-ink-muted mt-1 text-sm">
          {query ? `Results for "${query}"` : 'Search posts, users, and communities.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-surface-100/60 border border-white/5 rounded-2xl p-1.5 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === id ? 'text-white' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {activeTab === id && (
              <motion.div
                layoutId="search-tab"
                className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      {!query ? (
        <div className="bg-surface-100/60 border border-white/5 rounded-2xl p-12 text-center">
          <SearchIcon className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <p className="text-ink-muted text-sm">
            Type something in the search bar above to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Posts */}
          {activeTab === 'posts' && (
            loadingPosts ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : posts.length === 0 ? (
              <EmptyState label="No posts found" />
            ) : (
              <div className="space-y-4">
                {posts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )
          )}

          {/* Users */}
          {activeTab === 'users' && (
            loadingUsers ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : users.length === 0 ? (
              <EmptyState label="No users found" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {users.map((u, i) => (
                  <motion.div
                    key={u.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={`/u/${u.username}`}
                      className="flex items-center gap-3 bg-surface-100/60 border border-white/5 rounded-2xl p-4 hover:border-primary-500/30 transition-all"
                    >
                      <Avatar user={u} size="md" />
                      <div className="min-w-0">
                        <p className="font-semibold text-ink truncate">
                          {u.displayName || u.username}
                        </p>
                        <p className="text-xs text-ink-muted">@{u.username}</p>
                      </div>
                      <div className="ml-auto text-xs text-primary-400 font-medium">
                        {u.karmaPoints || 0} karma
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )
          )}

          {/* Communities */}
          {activeTab === 'communities' && (
            loadingCommunities ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : communities.length === 0 ? (
              <EmptyState label="No communities found" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {communities.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={`/c/${c.name}`}
                      className="flex items-start gap-3 bg-surface-100/60 border border-white/5 rounded-2xl p-4 hover:border-primary-500/30 transition-all"
                    >
                      <Avatar user={{ id: c.id, username: c.name }} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-ink truncate">c/{c.name}</p>
                        <p className="text-xs text-ink-muted mt-0.5 line-clamp-2">
                          {c.description || 'No description'}
                        </p>
                        <p className="text-[11px] text-ink-subtle mt-1">
                          {c.memberCount || 0} members
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )
          )}
        </>
      )}
    </motion.div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="bg-surface-100/60 border border-white/5 rounded-2xl p-12 text-center text-ink-muted text-sm">
      {label}
    </div>
  );
}