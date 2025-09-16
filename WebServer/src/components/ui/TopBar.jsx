import MenuToggle from './MenuToggle.jsx';
import UserInfo from './UserInfo.jsx';

/**
 * Barra superior de la aplicación
 * Contiene el toggle del menú, título y información del usuario
 */
export default function TopBar({ 
  open, 
  onToggleMenu, 
  title = 'Energy Monitoring System', 
  userName = 'Admin', 
  email = 'admin@example.com', 
  onLogout 
}) {
  return (
    <header className="sticky top-0 z-10 bg-zinc-950/70 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Menu Toggle */}
        <MenuToggle isOpen={open} onClick={onToggleMenu} />
        
        {/* Title */}
        <h1 className="text-lg font-semibold">{title}</h1>
        
        {/* Spacer */}
        <div className="flex-1" />
        
        {/* User Info */}
        <UserInfo 
          userName={userName} 
          email={email} 
          onLogout={onLogout} 
        />
      </div>
    </header>
  );
}
