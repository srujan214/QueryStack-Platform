import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Users, Bookmark, TrendingUp, Sparkles, Flame } from 'lucide-react';

const primaryLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/popular', label: 'Popular', icon: Flame },
  { to: '/trending', label: 'Trending', icon: TrendingUp },
  { to: '/communities', label: 'Communities', icon: Users },
  { to: '/bookmarks', label: 'Saved', icon: Bookmark },
  { to: '/explore', label: 'Explore', icon: Compass },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } };

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <motion.aside variants={container} initial="hidden" animate="show" className="hidden md:block w-60 flex-shrink-0">
      <div className="sticky top-20 space-y-4">
        <div className="bg-surface-100/80 backdrop-blur-sm border border-white/5 rounded-2xl p-2 shadow-card">
          {primaryLinks.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <motion.div key={to} variants={item}>
                <Link
                  to={to}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active ? 'text-primary-400 bg-primary-500/10' : 'text-ink-muted hover:bg-white/5 hover:text-ink'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div variants={item} className="relative overflow-hidden bg-gradient-to-br from-primary-600/20 to-purple-600/20 border border-primary-500/20 rounded-2xl p-4">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl" />
          <div className="relative">
            <Sparkles className="w-6 h-6 text-primary-400 mb-2" />
            <h3 className="text-sm font-bold text-ink">Be Curious</h3>
            <p className="text-xs text-ink-muted mt-1">Ask anything. Learn everything.</p>
          </div>
        </motion.div>

        <div className="px-3 py-2 text-[11px] text-ink-subtle space-y-1">
          <div className="flex gap-2 flex-wrap">
            <a href="#" className="hover:text-ink-muted">About</a>
            <a href="#" className="hover:text-ink-muted">Privacy</a>
            <a href="#" className="hover:text-ink-muted">Terms</a>
          </div>
          <p>QueryStack © 2026</p>
        </div>
      </div>
    </motion.aside>
  );
}