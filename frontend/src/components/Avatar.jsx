import { cn } from '../utils/cn';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

export default function Avatar({ user, size = 'md', className }) {
  const initial = (user?.displayName || user?.username || '?').charAt(0).toUpperCase();
  const gradients = [
    'from-primary-500 to-purple-500',
    'from-pink-500 to-orange-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-violet-500 to-fuchsia-500',
  ];
  const gradient = gradients[(user?.id || 0) % gradients.length];

  if (user?.profilePictureUrl) {
    return (
      <img
        src={user.profilePictureUrl}
        alt={user.username}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white',
        `bg-gradient-to-br ${gradient}`,
        sizes[size],
        className
      )}
    >
      {initial}
    </div>
  );
}