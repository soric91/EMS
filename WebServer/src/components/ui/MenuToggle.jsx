import { Menu } from 'lucide-react';

/**
 * Botón para toggle del menú sidebar
 */
export default function MenuToggle({ isOpen, onClick }) {
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
