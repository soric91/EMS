import { Menu } from 'lucide-react';
import { useSidebar } from '../../hooks/useSidebar.js';

/**
 * Botón para toggle del menú sidebar
 * Utiliza el hook useSidebar para obtener el estado
 */
export default function MenuToggle({ onClick }) {
  const { isOpen } = useSidebar();

  return (
    <button
      type="button"
      aria-label={isOpen ? 'Ocultar menú' : 'Mostrar menú'}
      onClick={onClick}
      className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-2 transition-colors"
    >
      <Menu className="w-5 h-5 text-zinc-200" />
    </button>
  );
}
