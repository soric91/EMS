import { Wifi } from 'lucide-react';

export default function SidebarHeader({ brand = 'Gateway Monitor', collapsed = false, onClose }) {
  return (
    <div className="px-3 py-4 border-b border-white/10">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
          {collapsed ? 'GM' : brand}
        </span>
        <Wifi className="w-4 h-4 text-emerald-400" />
      </div>
      {!collapsed && (
        <div className="mt-3 flex items-center justify-end">
          <button
            type="button"
            className="rounded p-1 text-zinc-300 hover:bg-white/5"
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
