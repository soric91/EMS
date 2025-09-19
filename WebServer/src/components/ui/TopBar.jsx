import MenuToggle from './MenuToggle.jsx';
import UserInfo from './UserInfo.jsx';
import { useTopBar } from '../../hooks/auth/useTopBar.js';

/**
 * Barra superior de la aplicación
 * Contiene el toggle del menú, título y información del usuario
 * Utiliza el hook useTopBar para manejar la lógica
 */
export default function TopBar({ title = 'Energy Monitoring System' }) {
  const {
    userDisplayName,
    handleMenuToggle,
    handleLogout,
    isAuthenticated
  } = useTopBar();

  // Si no está autenticado, no mostrar el TopBar
  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="sticky top-0 z-10 bg-zinc-950/70 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Menu Toggle */}
        <MenuToggle onClick={handleMenuToggle} />
        
        {/* Title */}
        <h1 className="text-lg font-semibold">{title}</h1>
        
        {/* Spacer */}
        <div className="flex-1" />
        
        {/* User Info */}
        <UserInfo 
          userName={userDisplayName}
          onLogout={handleLogout} 
        />
      </div>
    </header>
  );
}
