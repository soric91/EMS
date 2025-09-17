import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar el estado del sidebar
 * Gestiona la apertura/cierre y responsividad del sidebar
 */
export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es mobile al montar el componente y en resize
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      
      // En desktop, mantener sidebar abierto por defecto
      if (!mobile && !isOpen) {
        setIsOpen(true);
      }
      // En móvil, cerrarlo por defecto
      else if (mobile) {
        setIsOpen(false);
      }
    };

    // Check inicial
    checkIsMobile();

    // Listener para resize
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [isOpen]);

  // Función para toggle del sidebar
  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  // Función para cerrar sidebar (útil en mobile cuando se selecciona un item)
  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Función para abrir sidebar
  const openSidebar = () => {
    setIsOpen(true);
  };

  // Legacy support
  const toggle = toggleSidebar;
  const close = closeSidebar;
  const open = openSidebar;

  return {
    isOpen,
    isMobile,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    
    // Legacy support para compatibilidad
    toggle,
    close,
    open,
    
    // Computed values
    shouldShowOverlay: isMobile && isOpen,
    sidebarClasses: `fixed left-0 top-0 z-40 w-64 h-screen transition-transform ${
      isOpen ? 'transform-none' : '-translate-x-full'
    }`
  };
}
