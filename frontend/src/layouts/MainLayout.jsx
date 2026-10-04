import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  return (
    <>
      <div className="aurora-bg" />
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto flex gap-6 px-4 py-6">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}