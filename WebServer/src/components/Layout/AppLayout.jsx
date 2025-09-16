import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalState.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';
import TopBar from '../ui/TopBar.jsx';

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { user, logOutUser } = useGlobalState();

  const handleLogout = () => {
    logOutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar */}
      {open && (
        <div className="hidden md:block">
          <Sidebar collapsed={false} onClose={() => setOpen(false)} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <TopBar
          open={open}
          onToggleMenu={() => setOpen((v) => !v)}
          userName={user?.name || 'Usuario'}
          onLogout={handleLogout}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 overflow-y-auto">
          {children}
        </main>

        <footer className="px-4 sm:px-6 lg:px-8 py-4 text-center border-t border-white/10 text-zinc-500 text-sm">
          © 2025 EMS
        </footer>
      </div>
    </div>
  );
}
