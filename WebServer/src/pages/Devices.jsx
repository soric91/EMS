import { useState } from 'react';
import DeviceTable from '../components/configDevice/DeviceTable';
import DeviceFormUnified from '../components/configDevice/DeviceFormUnified';
import { useGlobalDevice } from '../context/GlobalDevice';
import HeaderDevice from '../components/configDevice/HeaderDevice.jsx';
import TotalDevice from '../components/configDevice/TotalDevice.jsx';
import ConnectedDevice from '../components/configDevice/ConnectedDevice.jsx';
import DisconnectedDevice from '../components/configDevice/DisconnectedDevice.jsx';

export default function DeviceManagement() {
  const [openModal, setOpenModal] = useState(false);
  const { devices } = useGlobalDevice();

  // Calculate stats
  const totalDevices = devices?.length || 0;
  const connectedDevices = devices?.filter(d => d.status === "Connected").length || 0;
  const disconnectedDevices = totalDevices - connectedDevices;
  

  const handleSync = () => {
    // TODO: Implement sync logic
    console.log('Syncing devices...');
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 space-y-6">
      {/* Header Section */}
      <HeaderDevice setOpenModal={setOpenModal} handleSync={handleSync} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Devices */}
        <TotalDevice totalDevices={totalDevices} />

        {/* Connected Devices */}
        <ConnectedDevice connectedDevices={connectedDevices} />

        {/* Disconnected Devices */}
        <DisconnectedDevice disconnectedDevices={disconnectedDevices} />

        {/* Connection Rate */}
        
      </div>

      {/* Device Table */}
      <div className="bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 backdrop-blur-sm rounded-2xl border border-zinc-700/30 overflow-hidden">
        <div className="p-6 border-b border-zinc-700/30">
          <h2 className="text-lg font-semibold text-white mb-1">Lista de Dispositivos</h2>
          <p className="text-sm text-zinc-400">Administra la configuración y estado de todos los dispositivos</p>
        </div>
        <DeviceTable />
      </div>

      {/* Add Device Modal - Usar componente unificado */}
      <DeviceFormUnified
        mode="modal"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={() => setOpenModal(false)}
      />
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
