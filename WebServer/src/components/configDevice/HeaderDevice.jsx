import React from 'react'
import { Plus, RefreshCw, Server } from 'lucide-react';
function HeaderDevice( { setOpenModal, handleSync }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              Gestión de Dispositivos
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              Monitor y administra todos los dispositivos del sistema
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleSync}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:bg-zinc-700/50 hover:border-zinc-600/50 hover:text-white transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-sm font-medium">Sincronizar</span>
          </button>
          
          <button 
            onClick={() => setOpenModal(true)}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span className="text-sm font-medium">Agregar Dispositivo</span>
          </button>
        </div>
      </div>
  )
}

export default HeaderDevice