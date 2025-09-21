import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Contexto para manejar el estado global del sidebar
 */
const SidebarContext = createContext();

/**
 * Hook para usar el contexto del sidebar
 */
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar debe ser usado dentro de SidebarProvider');
  }
  return context;
};

/**
 * Provider del contexto del sidebar
 */
export const SidebarProvider = ({ children }) => {
  // Initialize states with proper defaults
  const [isMobile, setIsMobile] = useState(() => {
    // Check if window is available (SSR safety)
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  
  const [isOpen, setIsOpen] = useState(() => {
    // Default: open on desktop, closed on mobile
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });

  // Memoized function to check mobile state
  const checkIsMobile = useCallback(() => {
    const mobile = window.innerWidth < 768; // md breakpoint
    
    if (mobile !== isMobile) {
      setIsMobile(mobile);
      
      // Auto-adjust sidebar state based on screen size
      if (mobile) {
        // On mobile, close sidebar
        setIsOpen(false);
      } else {
        // On desktop, open sidebar by default
        setIsOpen(true);
      }
    }
  }, [isMobile]);

  // Setup resize listener
  useEffect(() => {
    // Initial check
    checkIsMobile();

    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [checkIsMobile]);

  // Función para toggle del sidebar
  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => {
      console.log('Toggle sidebar:', !prev); // Debug log
      return !prev;
    });
  }, []);

  // Función para cerrar sidebar
  const closeSidebar = useCallback(() => {
    console.log('Close sidebar'); // Debug log
    setIsOpen(false);
  }, []);

  // Función para abrir sidebar
  const openSidebar = useCallback(() => {
    console.log('Open sidebar'); // Debug log
    setIsOpen(true);
  }, []);

  // Función específica para cerrar en mobile cuando se selecciona un item
  const closeSidebarOnMobile = useCallback(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [isMobile, closeSidebar]);

  // Context value
  const value = {
    // State
    isOpen,
    isMobile,
    
    // Actions
    toggleSidebar,
    closeSidebar,
    openSidebar,
    closeSidebarOnMobile,
    
    // Legacy support
    toggle: toggleSidebar,
    close: closeSidebar,
    open: openSidebar,
    
    // Computed values
    shouldShowOverlay: isMobile && isOpen,
    
    // CSS classes helpers
    getOverlayClasses: () => `
      fixed inset-0 z-30 bg-black/60 backdrop-blur-sm
      ${isMobile && isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      transition-opacity duration-300
    `,
    
    getSidebarClasses: () => `
      fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-zinc-900 to-zinc-950
      border-r border-zinc-800/50 backdrop-blur-md
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      w-64 md:w-64
    `,
    
    getDesktopSidebarClasses: () => `
      hidden md:block transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'w-0'} overflow-hidden
      bg-gradient-to-b from-zinc-900 to-zinc-950
      border-r border-zinc-800/50
    `
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
