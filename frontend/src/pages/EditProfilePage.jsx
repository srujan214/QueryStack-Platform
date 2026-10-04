import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, AlignLeft, Image as ImageIcon, Lock, Sparkles, Loader2, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import { userApi } from '../api/userApi';
import Input from '../components/Input';
import Button from '../components/Button';
import Avatar from '../components/Avatar';

// ============ Schemas ============
const profileSchema = z.object({
  displayName: z.string().min(1, 'Required').max(100),
  bio: z.string().max(500).optional().or(z.literal('')),
  profilePictureUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(6, 'At least 6 characters'),
  confirmPassword: z.string().min(6, 'Required'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ============ Component ============
export default function EditProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  // Preview state
  const [previewUrl, setPreviewUrl] = useState(user?.profilePictureUrl || '');

  // ============ Profile Form ============
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
    reset: resetProfile,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      bio: user?.bio || '',
      profilePictureUrl: user?.profilePictureUrl || '',
    },
  });

  useEffect(() => {
    setPreviewUrl(user?.profilePictureUrl || '');
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: (data) => userApi.updateProfile(data),
    onSuccess: (res) => {
      const updated = res.data?.data;
      if (updated) {
        updateUser(updated); // updates zustand + localStorage
        queryClient.invalidateQueries({ queryKey: ['user', user.username] });
      }
      toast.success('Profile updated!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Update failed');
    },
  });

  const onProfileSubmit = async (data) => {
    updateProfileMutation.mutate({
      displayName: data.displayName,
      bio: data.bio || null,
      profilePictureUrl: data.profilePictureUrl || null,
    });
  };

  // ============ Password Form ============
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: pwErrors, isSubmitting: pwSubmitting },
    reset: resetPassword,
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => userApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed!');
      resetPassword();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Password change failed');
    },
  });

  const onPasswordSubmit = (data) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  if (!user) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-5"
    >
      {/* Back link */}
      <Link
        to={`/u/${user.username}`}
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to profile
      </Link>

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold gradient-text">
          Edit Profile
        </h1>
        <p className="text-ink-muted mt-1 text-sm">
          Update your personal information and security settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-surface-100/60 border border-white/5 rounded-2xl p-1.5 w-fit">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'security', label: 'Security', icon: Lock },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === id ? 'text-white' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {activeTab === id && (
              <motion.div
                layoutId="edit-tab"
                className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      {/* ==================== PROFILE TAB ==================== */}
      {activeTab === 'profile' && (
        <motion.form
          key="profile-form"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleProfileSubmit(onProfileSubmit)}
          className="bg-surface-100/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6 space-y-5"
        >
          {/* Avatar preview */}
          <div className="flex items-center gap-5 p-4 rounded-2xl bg-gradient-to-r from-primary-600/10 to-purple-600/10 border border-primary-500/20">
            <Avatar
              user={{ ...user, profilePictureUrl: previewUrl }}
              size="xl"
            />
            <div>
              <p className="font-display font-bold text-lg">
                {user.displayName || user.username}
              </p>
              <p className="text-sm text-ink-muted">@{user.username}</p>
              <p className="text-xs text-ink-subtle mt-1">
                Preview updates as you type the URL below
              </p>
            </div>
          </div>

          {/* Display name */}
          <Input
            label="Display Name"
            placeholder="Srujan Naik"
            icon={Sparkles}
            error={profileErrors.displayName?.message}
            {...registerProfile('displayName')}
          />

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-2 ml-1">
              Bio
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-3.5 top-3.5 w-4 h-4 text-ink-subtle" />
              <textarea
                {...registerProfile('bio')}
                placeholder="Tell the community about yourself..."
                rows={4}
                maxLength={500}
                className="w-full bg-surface-50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder-ink-subtle focus:border-primary-500/50 focus:bg-surface-100 transition-all resize-none"
              />
            </div>
            {profileErrors.bio && (
              <p className="text-red-400 text-xs mt-1.5 ml-1">
                {profileErrors.bio.message}
              </p>
            )}
          </div>

          {/* Profile picture URL */}
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-2 ml-1">
              Profile Picture URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
              <input
                {...registerProfile('profilePictureUrl')}
                onChange={(e) => {
                  registerProfile('profilePictureUrl').onChange(e);
                  setPreviewUrl(e.target.value);
                }}
                placeholder="https://example.com/avatar.jpg"
                className="w-full bg-surface-50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-ink placeholder-ink-subtle focus:border-primary-500/50 focus:bg-surface-100 transition-all"
              />
            </div>
            {profileErrors.profilePictureUrl && (
              <p className="text-red-400 text-xs mt-1.5 ml-1">
                {profileErrors.profilePictureUrl.message}
              </p>
            )}
            <p className="text-[11px] text-ink-subtle mt-2 ml-1">
              Tip: Get a free avatar at{' '}
              <a
                href="https://i.pravatar.cc"
                target="_blank"
                rel="noreferrer"
                className="text-primary-400 hover:underline"
              >
                i.pravatar.cc
              </a>{' '}
              or{' '}
              <a
                href="https://ui-avatars.com"
                target="_blank"
                rel="noreferrer"
                className="text-primary-400 hover:underline"
              >
                ui-avatars.com
              </a>
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <Button
              type="submit"
              loading={updateProfileMutation.isPending}
              size="lg"
            >
              <Save className="w-4 h-4" />
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => resetProfile()}
            >
              Reset
            </Button>
          </div>
        </motion.form>
      )}

      {/* ==================== SECURITY TAB ==================== */}
      {activeTab === 'security' && (
        <motion.form
          key="password-form"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          className="bg-surface-100/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
            <Lock className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-sm font-medium text-ink">
                Change your password
              </p>
              <p className="text-xs text-ink-muted mt-0.5">
                Make sure it's at least 6 characters.
              </p>
            </div>
          </div>

          <Input
            type="password"
            label="Current Password"
            placeholder="••••••••"
            icon={Lock}
            error={pwErrors.currentPassword?.message}
            {...registerPassword('currentPassword')}
          />

          <Input
            type="password"
            label="New Password"
            placeholder="At least 6 characters"
            icon={Lock}
            error={pwErrors.newPassword?.message}
            {...registerPassword('newPassword')}
          />

          <Input
            type="password"
            label="Confirm New Password"
            placeholder="Repeat new password"
            icon={Lock}
            error={pwErrors.confirmPassword?.message}
            {...registerPassword('confirmPassword')}
          />

          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <Button
              type="submit"
              loading={changePasswordMutation.isPending}
              size="lg"
            >
              <Save className="w-4 h-4" />
              {changePasswordMutation.isPending
                ? 'Changing...'
                : 'Change Password'}
            </Button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
}