import React from 'react'
import { Activity} from 'lucide-react';
function ConnectedDevice(   { connectedDevices }) {
    return (
        <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <Activity className="w-5 h-5 text-green-400" />
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">{connectedDevices}</p>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider">Online</p>
                </div>
            </div>
            <h3 className="text-sm font-medium text-zinc-300 mb-1">Conectados</h3>
            <p className="text-xs text-zinc-500">Dispositivos activos</p>
        </div>
    )
}

export default ConnectedDevice