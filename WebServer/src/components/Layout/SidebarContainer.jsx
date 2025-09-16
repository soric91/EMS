import { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar.jsx';

/**
 * Contenedor que maneja la lógica del sidebar responsive
 */
export default function SidebarContainer({ isOpen, onToggle }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // En móvil, mostrar overlay cuando está abierto
  if (isMobile) {
    return (
      <>
        {/* Overlay para móvil */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={onToggle}
          />
        )}
        
        {/* Sidebar móvil */}
        <div className={`
          fixed left-0 top-0 bottom-0 z-30 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:hidden
        `}>
          <Sidebar collapsed={false} onClose={onToggle} />
        </div>
      </>
    );
  }

  // En desktop, comportamiento normal
  return (
    <>
      {isOpen && (
        <div className="hidden md:block">
          <Sidebar collapsed={false} onClose={onToggle} />
        </div>
      )}
    </>
  );
}
