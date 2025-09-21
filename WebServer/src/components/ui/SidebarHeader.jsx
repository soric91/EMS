import { Activity, Zap } from 'lucide-react';
import { useSystemStatus } from '../../hooks/useSystemStatus.js';

export default function SidebarHeader({ brand = 'Gateway Monitor' }) {
  const { isOnline, label, getStatusColor, getDotColor } = useSystemStatus();

  return (
    <div className="px-4 py-4 border-b border-zinc-800/50">
      {/* Brand Title */}
      <div className="mb-3">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent tracking-tight">
          {brand}
        </h1>
      </div>
      
      {/* System Status - Clean design */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/40 border border-zinc-700/40 hover:border-zinc-600/60 transition-colors duration-200">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Activity className={`w-3.5 h-3.5 ${getStatusColor()} transition-colors duration-200`} />
            <div className={`ml-1 w-1.5 h-1.5 ${getDotColor()} rounded-full animate-pulse`} />
          </div>
          <div className="text-xs font-medium text-zinc-200">Sistema</div>
        </div>
        
        {/* Status label */}
        <div className={`text-xs font-semibold ${getStatusColor()} uppercase tracking-wide`}>
          {label}
        </div>
        
        {/* Energy indicator */}
        {isOnline && (
          <div className="ml-auto">
            <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
