import { useState } from 'react';
import { Plus, RefreshCw, Server, Activity, Zap, AlertTriangle } from 'lucide-react';

import DeviceTable from '../components/configDevice/DeviceTable';
import AddDeviceModal from '../components/configDevice/AddDeviceModal';
import { useGlobalDevice } from '../context/GlobalDevice';

export default function DeviceManagement() {
  const [openModal, setOpenModal] = useState(false);
  const { devices } = useGlobalDevice();

  // Calculate stats
  const totalDevices = devices?.length || 0;
  const connectedDevices = devices?.filter(d => d.status === "Connected").length || 0;
  const disconnectedDevices = totalDevices - connectedDevices;
  const connectionPercentage = totalDevices > 0 ? Math.round((connectedDevices / totalDevices) * 100) : 0;

  const handleSync = () => {
    // TODO: Implement sync logic
    console.log('Syncing devices...');
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 space-y-6">
      {/* Header Section */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Devices */}
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

        {/* Connected Devices */}
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

        {/* Disconnected Devices */}
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

        {/* Connection Rate */}
        <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-400">{connectionPercentage}%</p>
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Tasa</p>
            </div>
          </div>
          <h3 className="text-sm font-medium text-zinc-300 mb-1">Conectividad</h3>
          <div className="w-full bg-zinc-700/50 rounded-full h-1.5 mt-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1.5 rounded-full transition-all duration-1000" 
              style={{ width: `${connectionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Device Table */}
      <div className="bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 backdrop-blur-sm rounded-2xl border border-zinc-700/30 overflow-hidden">
        <div className="p-6 border-b border-zinc-700/30">
          <h2 className="text-lg font-semibold text-white mb-1">Lista de Dispositivos</h2>
          <p className="text-sm text-zinc-400">Administra la configuración y estado de todos los dispositivos</p>
        </div>
        <DeviceTable />
      </div>

      {/* Add Device Modal */}
      <AddDeviceModal isOpen={openModal} onClose={() => setOpenModal(false)} />
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
