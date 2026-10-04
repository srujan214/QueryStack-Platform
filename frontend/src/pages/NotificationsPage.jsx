import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bell, Check, Trash2, Loader2, ArrowBigUp, MessageSquare, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { notificationApi } from '../api/notificationApi';
import Avatar from '../components/Avatar';
import Button from '../components/Button';

const iconFor = (type) => {
  if (type?.includes('UPVOTE')) return ArrowBigUp;
  if (type?.includes('COMMENT') || type?.includes('REPLY')) return MessageSquare;
  if (type?.includes('INVITE')) return Users;
  return Bell;
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getAll(0, 50),
  });

  const notifications = data?.data?.data?.content || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => {
      toast.success('All marked as read');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markRead = useMutation({
    mutationFn: (id) => notificationApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const deleteOne = useMutation({
    mutationFn: (id) => notificationApi.delete(id),
    onSuccess: () => {
      toast.success('Notification removed');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const clearAll = useMutation({
    mutationFn: () => notificationApi.clearAll(),
    onSuccess: () => {
      toast.success('All notifications cleared');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5 max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold gradient-text">Notifications</h1>
          <p className="text-ink-muted mt-1 text-sm">
            {unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up.'}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => markAllRead.mutate()}
              loading={markAllRead.isPending}
            >
              <Check className="w-4 h-4" /> Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => clearAll.mutate()}
              loading={clearAll.isPending}
            >
              <Trash2 className="w-4 h-4" /> Clear all
            </Button>
          )}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-surface-100/60 border border-white/5 rounded-2xl p-12 text-center">
          <Bell className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <h3 className="font-display text-lg font-bold mb-2">No notifications</h3>
          <p className="text-ink-muted text-sm">
            You're all caught up! Come back later.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {notifications.map((n, i) => {
              const Icon = iconFor(n.type);
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => !n.isRead && markRead.mutate(n.id)}
                  className={`relative group flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    n.isRead
                      ? 'bg-surface-100/40 border-white/5'
                      : 'bg-primary-500/5 border-primary-500/20 hover:border-primary-500/40'
                  }`}
                >
                  {/* Unread dot */}
                  {!n.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  )}

                  <div className="relative">
                    <Avatar user={n.actor} size="md" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface-100 border border-white/10 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-primary-400" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink">{n.message || 'New activity'}</p>
                    <p className="text-xs text-ink-subtle mt-1">
                      {n.createdAt
                        ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })
                        : ''}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteOne.mutate(n.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/5 text-ink-subtle hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}