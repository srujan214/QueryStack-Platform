import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Plus, Lock, Search as SearchIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { communityApi } from '../api/communityApi';
import Button from '../components/Button';
import Avatar from '../components/Avatar';

export default function CommunitiesPage() {
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', isPrivate: false });

  const { data, isLoading } = useQuery({
    queryKey: ['communities', 'all'],
    queryFn: () => communityApi.getAll(0, 50),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => communityApi.create(payload),
    onSuccess: () => {
      toast.success('Community created!');
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      setShowCreate(false);
      setForm({ name: '', description: '', isPrivate: false });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const communities = data?.data?.data?.content || [];

  const filtered = communities.filter((c) =>
    c.name.toLowerCase().includes(keyword.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(keyword.toLowerCase())
  );

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    createMutation.mutate({
      name: form.name.trim().toLowerCase(),
      description: form.description,
      isPrivate: form.isPrivate,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold gradient-text">
            Communities
          </h1>
          <p className="text-ink-muted mt-1 text-sm">
            Discover and join communities.
          </p>
        </div>
        <Button
          variant={showCreate ? 'secondary' : 'primary'}
          onClick={() => setShowCreate((v) => !v)}
        >
          <Plus className="w-4 h-4" />
          {showCreate ? 'Cancel' : 'Create Community'}
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleCreate}
          className="bg-surface-100/60 border border-white/5 rounded-2xl p-5 space-y-4 overflow-hidden"
        >
          <input
            type="text"
            placeholder="Community name (e.g. programming)"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full bg-surface-50 border border-white/5 rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-subtle focus:border-primary-500/50 transition-all"
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full bg-surface-50 border border-white/5 rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-subtle focus:border-primary-500/50 transition-all resize-none"
          />
          <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPrivate}
              onChange={(e) => setForm((f) => ({ ...f, isPrivate: e.target.checked }))}
              className="w-4 h-4 accent-primary-500"
            />
            <Lock className="w-3.5 h-3.5" />
            Make this community private
          </label>
          <Button type="submit" loading={createMutation.isPending}>
            Create Community
          </Button>
        </motion.form>
      )}

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search communities..."
          className="w-full bg-surface-100/60 border border-white/5 rounded-full pl-11 pr-4 py-3 text-sm text-ink placeholder-ink-subtle focus:border-primary-500/50 transition-all"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-100/60 border border-white/5 rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <h3 className="font-display text-lg font-bold mb-2">
            No communities yet
          </h3>
          <p className="text-ink-muted text-sm">
            Be the first to create one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/c/${c.name}`}
                className="block bg-surface-100/60 backdrop-blur-sm border border-white/5 rounded-2xl p-5 hover:border-primary-500/30 hover:-translate-y-1 transition-all duration-200 shadow-card hover:shadow-card-hover"
              >
                <div className="flex items-start gap-4">
                  <Avatar user={{ id: c.id, username: c.name }} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-ink truncate">
                        c/{c.name}
                      </h3>
                      {c.isPrivate && <Lock className="w-3.5 h-3.5 text-ink-subtle flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-ink-muted mt-1 line-clamp-2">
                      {c.description || 'No description yet.'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-ink-subtle mt-3">
                      <Users className="w-3.5 h-3.5" />
                      {c.memberCount || 0} members
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}