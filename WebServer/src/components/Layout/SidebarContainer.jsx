import Sidebar from '../Sidebar/Sidebar.jsx';
import { useSidebar } from '../../hooks/useSidebar.js';

/**
 * Contenedor que maneja la lógica del sidebar responsive
 * Utiliza el hook useSidebar para manejar el estado
 */
export default function SidebarContainer() {
  const { 
    isOpen, 
    isMobile, 
    toggleSidebar, 
    shouldShowOverlay, 
    sidebarClasses 
  } = useSidebar();

  // En móvil, mostrar overlay cuando está abierto
  if (isMobile) {
    return (
      <>
        {/* Overlay para móvil */}
        {shouldShowOverlay && (
          <div 
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Sidebar para móvil */}
        <div className={sidebarClasses}>
          <Sidebar onItemClick={toggleSidebar} />
        </div>
      </>
    );
  }

  // En desktop, sidebar estático
  return (
    <div className={`transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
      <div className="w-64 h-screen">
        <Sidebar />
      </div>
    </div>
  );
}
