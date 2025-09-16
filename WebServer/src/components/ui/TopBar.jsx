import { Menu, User, LogOut } from 'lucide-react';

export default function TopBar({ open, onToggleMenu, title = 'Energy Monitoring System', userName = 'Usuario', onLogout }) {
  return (
    <header className="sticky top-0 z-10 bg-zinc-950/70 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          aria-label={open ? 'Ocultar menú' : 'Mostrar menú'}
          onClick={onToggleMenu}
          className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-2"
        >
          <Menu className="w-5 h-5 text-zinc-200" />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-300">
            <User className="w-4 h-4" />
            <span className="truncate max-w-[14ch]" title={userName}>{userName}</span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-xs text-zinc-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}
