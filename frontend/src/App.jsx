import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import CommunitiesPage from './pages/CommunitiesPage';
import CommunityDetailPage from './pages/CommunityDetailPage';
import PostDetailPage from './pages/PostDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import BookmarksPage from './pages/BookmarksPage';
import SearchPage from './pages/SearchPage';
import PopularPage from './pages/PopularPage';
import TrendingPage from './pages/TrendingPage';
import EditProfilePage from './pages/EditProfilePage';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function Placeholder({ title }) {
  return (
    <div className="bg-surface-100/60 border border-white/5 rounded-2xl p-12 text-center">
      <h2 className="font-display text-2xl font-bold gradient-text mb-2">{title}</h2>
      <p className="text-ink-muted text-sm">Coming soon.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/c/:name" element={<CommunityDetailPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/u/:username" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/popular" element={<PopularPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/explore" element={<Placeholder title="Explore" />} />
        <Route path="/settings/profile" element={<EditProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}