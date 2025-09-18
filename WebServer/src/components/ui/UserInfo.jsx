import { User, LogOut } from 'lucide-react';
import { capitalizar } from '../../utils/utils.js';

/**
 * Componente que muestra la información del usuario y el botón de logout
 */
export default function UserInfo({ userName, email, onLogout }) {
  return (
    <div className="flex items-center gap-3">
      {/* Info del usuario - solo visible en pantallas medianas+ */}
      <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-300">
        <span className="truncate max-w-[14ch]" title={userName}>
          {capitalizar(userName)}
        </span>
        <User className="w-4 h-4 text-green-500" />
        <span className="font-medium" title={email}>
          {email}
        </span>
      </div>
      
      {/* Botón de logout */}
      <button
        type="button"
        onClick={onLogout}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-xs text-zinc-200 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Salir</span>
      </button>
    </div>
  );
}
