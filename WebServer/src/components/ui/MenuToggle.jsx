import { Menu, X } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext.jsx';

/**
 * Botón para toggle del menú sidebar
 * Utiliza el contexto SidebarContext directamente
 */
export default function MenuToggle({ onClick, className = '' }) {
  const { isOpen, toggleSidebar, isMobile } = useSidebar();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('MenuToggle clicked, current state:', isOpen); // Debug log
    
    // Use the context toggle function directly
    toggleSidebar();
    
    // Call external onClick if provided (for additional logic)
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type="button"
      aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      onClick={handleClick}
      className={`
        group relative rounded-xl border border-white/10 bg-white/5 
        hover:bg-white/10 hover:border-white/20 active:bg-white/15
        p-2.5 transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        ${className}
      `}
    >
      {/* Icon container with animation */}
      <div className="relative w-5 h-5">
        {/* Menu icon */}
        <Menu 
          className={`
            absolute inset-0 w-5 h-5 text-zinc-200 transition-all duration-200
            ${isOpen ? 'rotate-90 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'}
            group-hover:text-white
          `} 
        />
        
        {/* Close icon */}
        <X 
          className={`
            absolute inset-0 w-5 h-5 text-zinc-200 transition-all duration-200
            ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-75'}
            group-hover:text-white
          `} 
        />
      </div>
      
      {/* Hover indicator */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      
      {/* Mobile indicator */}
      {isMobile && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full opacity-75" />
      )}
    </button>
  );
}
