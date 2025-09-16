import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar el estado del sidebar
 */
export function useSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  // Cerrar sidebar en móvil por defecto
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize(); // Ejecutar al montar
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggle = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return {
    isOpen,
    toggle,
    close,
    open
  };
}
