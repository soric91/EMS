import React from 'react'
import {  AlertTriangle } from 'lucide-react';
function DisconnectedDevice( { disconnectedDevices }) {
    return (
        <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-red-400">{disconnectedDevices}</p>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider">Offline</p>
                </div>
            </div>
            <h3 className="text-sm font-medium text-zinc-300 mb-1">Desconectados</h3>
            <p className="text-xs text-zinc-500">Dispositivos inactivos</p>
        </div>
    )
}

export default DisconnectedDevice