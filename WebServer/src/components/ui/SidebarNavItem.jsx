import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext.jsx';
import { ChevronRight } from 'lucide-react';

export default function SidebarNavItem({ 
  to, 
  label, 
  Icon, 
  description, 
  gradient = 'from-blue-500 to-purple-500',
  onClose 
}) {
  const location = useLocation();
  const { isMobile } = useSidebar();
  const active = location.pathname === to;

  const handleClick = () => {
    // En móvil, cerrar el sidebar cuando se hace clic en un item
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`
        group relative flex items-center gap-3 rounded-xl px-4 py-3
        border transition-all duration-300 ease-out
        ${active
          ? `
            bg-gradient-to-r ${gradient} text-white shadow-lg shadow-blue-500/25
            border-white/20 transform scale-[1.02]
          `
          : `
            text-zinc-300 hover:text-white border-transparent
            hover:bg-white/5 hover:border-white/10 hover:transform hover:scale-[1.01]
            hover:shadow-lg hover:shadow-black/10
          `
        }
      `}
    >
      {/* Active indicator */}
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
      )}

      {/* Icon container */}
      <div className={`
        relative p-2 rounded-lg transition-all duration-300
        ${active 
          ? 'bg-white/20 backdrop-blur-sm' 
          : 'bg-zinc-800/30 group-hover:bg-zinc-700/50'
        }
      `}>
        <Icon className="w-4 h-4 shrink-0" />
        
        {/* Icon glow effect for active state */}
        {active && (
          <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${gradient} opacity-20 blur-md`} />
        )}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className={`font-medium transition-colors duration-300 ${
          active ? 'text-white' : 'text-zinc-200 group-hover:text-white'
        }`}>
          {label}
        </div>
        {description && (
          <div className={`text-xs mt-0.5 transition-colors duration-300 ${
            active ? 'text-white/80' : 'text-zinc-500 group-hover:text-zinc-400'
          }`}>
            {description}
          </div>
        )}
      </div>

      {/* Arrow indicator */}
      <ChevronRight className={`
        w-4 h-4 shrink-0 transition-all duration-300
        ${active 
          ? 'text-white transform rotate-0 opacity-100' 
          : 'text-zinc-500 transform -rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100'
        }
      `} />

      {/* Hover glow effect */}
      {!active && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      )}
    </Link>
  );
}
