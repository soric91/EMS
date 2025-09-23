import React from 'react'
import {  Server } from 'lucide-react';
function TotalDevice({ totalDevices }) {
    return (
        <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Server className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-white">{totalDevices}</p>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider">Total</p>
                </div>
            </div>
            <h3 className="text-sm font-medium text-zinc-300 mb-1">Dispositivos</h3>
            <p className="text-xs text-zinc-500">Todos los dispositivos registrados</p>
        </div>
    )
}

export default TotalDevice