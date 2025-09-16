import { Home, LayoutDashboard, Server, FileText, Settings } from 'lucide-react';
import SidebarHeader from '../ui/SidebarHeader.jsx';
import SidebarNavItem from '../ui/SidebarNavItem.jsx';
import { useGlobalState } from '../../context/GlobalState.jsx';

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/devices', label: 'Devices', icon: Server },
  { to: '/logs', label: 'Logs', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings, adminOnly: true }, // ← añadir flag
  // { to: '/users', label: 'Users', icon: Users }, // habilitar cuando exista la página
];

export default function Sidebar({ collapsed, onClose }) {
  const { user } = useGlobalState();
  
  // Filtrar items basado en permisos
  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && !user?.is_admin) {
      return false; // Omitir si es solo admin y el usuario no es admin
    }
    return true; // Incluir todos los demás items
  });

  return (
    <aside
      className={`
        group relative h-full
        ${collapsed ? 'w-[70px]' : 'w-64'}
        transition-all duration-200 ease-out
        border-r border-white/10 bg-zinc-950/60 backdrop-blur-md
      `}
    >
      {/* Header brand */}
      <SidebarHeader brand="Gateway Monitor" collapsed={collapsed} onClose={onClose} />

      {/* Nav */}
      <nav className="p-3 space-y-1">
        {filteredNavItems.map(({ to, label, icon: Icon }) => (
          <SidebarNavItem key={to} to={to} label={label} Icon={Icon} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  );
}