import { Home, LayoutDashboard, Server, FileText, Settings } from 'lucide-react';
import SidebarHeader from '../ui/SidebarHeader.jsx';
import SidebarNavItem from '../ui/SidebarNavItem.jsx';
import { useGlobalState } from '../../context/GlobalState.jsx';
import { useSidebar } from '../../context/SidebarContext.jsx';

const navItems = [
  { 
    to: '/home', 
    label: 'Inicio', 
    icon: Home,
    description: 'Dashboard principal',
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    to: '/dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard,
    description: 'Métricas del sistema',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    to: '/devices', 
    label: 'Dispositivos', 
    icon: Server,
    description: 'Gestión de equipos',
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    to: '/logs', 
    label: 'Registros', 
    icon: FileText,
    description: 'Logs del sistema',
    gradient: 'from-orange-500 to-red-500'
  },
  { 
    to: '/settings', 
    label: 'Configuración', 
    icon: Settings, 
    adminOnly: true,
    description: 'Ajustes del sistema',
    gradient: 'from-gray-500 to-slate-500'
  }
];

export default function Sidebar({ onClose }) {
  const { user } = useGlobalState();
  const { isOpen, isMobile } = useSidebar();
  
  // Filtrar items basado en permisos
  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && !user?.is_admin) {
      return false;
    }
    return true;
  });

  return (
    <aside className="relative h-full w-full overflow-hidden bg-gradient-to-b from-zinc-900/95 via-zinc-900/98 to-zinc-950">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header brand */}
        <div className="flex-shrink-0">
          <SidebarHeader brand="EMS Gateway" onClose={onClose} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto hover:pr-2 transition-all duration-200 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {filteredNavItems.map(({ to, label, icon: Icon, description, gradient }, index) => (
            <div
              key={to}
              className={`transform transition-all duration-300 ${
                isOpen 
                  ? 'translate-x-0 opacity-100 delay-' + (index * 100) 
                  : '-translate-x-4 opacity-0'
              }`}
            >
              <SidebarNavItem 
                to={to} 
                label={label} 
                Icon={Icon}
                description={description}
                gradient={gradient}
                onClose={onClose}
              />
            </div>
          ))}
        </nav>

        {/* Footer info */}
        <div className="flex-shrink-0 p-4 border-t border-zinc-800/50">
          <div className="text-xs text-zinc-500 space-y-1">
            <div className="flex justify-between">
              <span>Versión</span>
              <span className="text-zinc-400">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Usuario</span>
              <span className="text-zinc-400 truncate max-w-20">
                {user?.username || 'Usuario'}
              </span>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
