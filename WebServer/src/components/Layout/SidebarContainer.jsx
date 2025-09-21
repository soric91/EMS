import Sidebar from '../Sidebar/Sidebar.jsx';
import { useSidebar } from '../../context/SidebarContext.jsx';

/**
 * Contenedor que maneja la lógica del sidebar responsive
 * Utiliza el contexto SidebarContext para manejar el estado
 */
export default function SidebarContainer() {
  const { 
    isOpen, 
    isMobile, 
    closeSidebarOnMobile,
    getOverlayClasses,
    getSidebarClasses,
    getDesktopSidebarClasses
  } = useSidebar();

  const handleOverlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile && isOpen) {
      closeSidebarOnMobile();
    }
  };

  return (
    <>
      {/* Overlay para móvil - solo se muestra cuando está abierto en móvil */}
      <div 
        className={`md:hidden ${getOverlayClasses()}`}
        onClick={handleOverlayClick}
        aria-hidden={!isMobile || !isOpen}
      />
      
      {/* Sidebar para móvil */}
      <aside className={`md:hidden ${getSidebarClasses()}`}>
        <div className="relative w-full h-full">
          <Sidebar onClose={closeSidebarOnMobile} />
          
          {/* Mobile sidebar decorations */}
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-zinc-700/50 to-transparent" />
        </div>
      </aside>

      {/* Sidebar para desktop */}
      <aside className={getDesktopSidebarClasses()}>
        <div className="w-64 h-screen relative">
          <Sidebar />
          
          {/* Desktop sidebar decorations */}
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-zinc-700/50 to-transparent" />
          
          {/* Glow effect when open */}
          {isOpen && (
            <div className="absolute inset-y-0 -right-px w-4 bg-gradient-to-r from-transparent to-blue-500/5 pointer-events-none" />
          )}
        </div>
      </aside>
    </>
  );
}
