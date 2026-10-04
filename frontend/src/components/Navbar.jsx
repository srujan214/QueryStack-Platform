import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Bell,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  Settings,
  Bookmark,
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import Avatar from './Avatar';
import Button from './Button';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [keyword, setKeyword] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 glass border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-glow"
          >
            <span className="text-white font-bold text-lg">Q</span>
          </motion.div>
          <span className="hidden sm:block font-display text-xl font-bold gradient-text">
            QueryStack
          </span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            <input
              type="text"
              placeholder="Search QueryStack..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-surface-50 border border-white/5 rounded-full text-sm text-ink placeholder-ink-subtle focus:border-primary-500/50 focus:bg-surface-100 transition-all duration-200"
            />
          </div>
        </form>

        {isAuthenticated ? (
          <>
            <div className="hidden md:flex items-center gap-2 ml-auto">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/create-post')}
                className="flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Create
              </Button>

              <Link
                to="/notifications"
                className="relative p-2.5 rounded-full hover:bg-white/5 transition-colors"
              >
                <Bell className="w-5 h-5 text-ink-muted" />
              </Link>

              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/5 transition-colors"
                >
                  <Avatar user={user} size="sm" />
                  <span className="text-sm font-medium text-ink">
                    {user?.username}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-surface-100 border border-white/10 rounded-xl shadow-card overflow-hidden z-50"
                      >
                        {/* User header */}
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-sm font-semibold text-ink truncate">
                            {user?.displayName || user?.username}
                          </p>
                          <p className="text-xs text-ink-subtle truncate">
                            @{user?.username}
                          </p>
                        </div>

                        <Link
                          to={`/u/${user?.username}`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-ink-muted hover:bg-white/5 hover:text-ink transition-colors"
                        >
                          <UserIcon className="w-4 h-4" />
                          View Profile
                        </Link>

                        <Link
                          to="/settings/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-ink-muted hover:bg-white/5 hover:text-ink transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Edit Profile
                        </Link>

                        <Link
                          to="/bookmarks"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-ink-muted hover:bg-white/5 hover:text-ink transition-colors"
                        >
                          <Bookmark className="w-4 h-4" />
                          Saved Posts
                        </Link>

                        <div className="border-t border-white/5" />

                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden ml-auto p-2 rounded-lg hover:bg-white/5"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-surface-100/50"
          >
            <div className="p-4 space-y-3">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-50 border border-white/5 rounded-full text-sm text-ink"
                />
              </form>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  navigate('/create-post');
                  setMobileMenuOpen(false);
                }}
              >
                <Plus className="w-4 h-4" /> Create Post
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  navigate('/settings/profile');
                  setMobileMenuOpen(false);
                }}
              >
                <Settings className="w-4 h-4" /> Edit Profile
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}