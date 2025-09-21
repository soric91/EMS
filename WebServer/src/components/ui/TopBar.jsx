import MenuToggle from './MenuToggle.jsx';
import UserInfo from './UserInfo.jsx';
import { useAuth } from '../../hooks/auth/useAuth.js';

/**
 * Barra superior de la aplicación
 * Contiene el toggle del menú, título y información del usuario
 * Simplificada para usar directamente el contexto del sidebar
 */
export default function TopBar({ title = 'Energy Monitoring System' }) {
  const { user, logout } = useAuth();

  // Si no está autenticado, no mostrar el TopBar
  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const userDisplayName = user?.username || user?.email || 'Usuario';

  return (
    <header className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 shadow-lg">
      <div className="flex items-center gap-4 px-4 lg:px-6 py-3">
        {/* Menu Toggle */}
        <MenuToggle />
        
        {/* Title with gradient */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          <h1 className="text-lg font-semibold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        
        {/* Spacer */}
        <div className="flex-1" />
        
        {/* System status indicator (optional) */}
        <div className="hidden md:flex items-center gap-2 text-sm text-zinc-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Online</span>
        </div>
        
        {/* User Info */}
        <UserInfo 
          userName={userDisplayName}
          onLogout={handleLogout} 
        />
      </div>
      
      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
    </header>
  );
}
