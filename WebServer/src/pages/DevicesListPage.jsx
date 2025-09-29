import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeviceTable from '../components/configDevice/DeviceTable';
import DeviceFormUnified from '../components/configDevice/DeviceFormUnified';
import { useGlobalDevice } from '../context/GlobalDevice';
import HeaderDevice from '../components/configDevice/HeaderDevice.jsx';
import TotalDevice from '../components/configDevice/TotalDevice.jsx';
import ConnectedDevice from '../components/configDevice/ConnectedDevice.jsx';
import DisconnectedDevice from '../components/configDevice/DisconnectedDevice.jsx';

/**
 * Página principal de lista de dispositivos
 * Reutiliza componentes existentes pero con navegación mejorada
 */
export default function DevicesListPage() {
  const navigate = useNavigate();
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

  const handleAddDevice = () => {
    // Opción 1: Usar modal (comportamiento actual)
    setOpenModal(true);
    
    // Opción 2: Navegar a página dedicada
    // navigate('/devices/new');
  };

  const handleDeviceClick = (deviceId) => {
    // Navegar a vista detallada del dispositivo
    navigate(`/devices/${deviceId}`);
  };

  const handleEditDevice = (device) => {
    // Opción 1: Modal inline (comportamiento actual mejorado)
    setOpenModal(true);
    
    // Opción 2: Navegar a página de edición
    // navigate(`/devices/${device.id}/edit`);
  };

  const handleDeviceSaved = () => {
    setOpenModal(false);
    // Refresh automático manejado por GlobalDevice context
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 space-y-6">
      {/* Header Section */}
      <HeaderDevice 
        setOpenModal={setOpenModal} 
        handleSync={handleSync}
        onAddDevice={handleAddDevice}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TotalDevice totalDevices={totalDevices} />
        <ConnectedDevice connectedDevices={connectedDevices} />
        <DisconnectedDevice disconnectedDevices={disconnectedDevices} />
        
        {/* Connection Rate Card */}
        <div className="bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 backdrop-blur-sm rounded-2xl border border-zinc-700/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Tasa de Conexión</p>
              <p className="text-2xl font-bold text-white">
                {totalDevices > 0 ? Math.round((connectedDevices / totalDevices) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className={`w-6 h-6 rounded-full ${
                connectedDevices / totalDevices > 0.8 ? 'bg-green-500' : 
                connectedDevices / totalDevices > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Device Table */}
      <div className="bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 backdrop-blur-sm rounded-2xl border border-zinc-700/30 overflow-hidden">
        <div className="p-6 border-b border-zinc-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Lista de Dispositivos</h2>
              <p className="text-sm text-zinc-400">Administra la configuración y estado de todos los dispositivos</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/devices/new')}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 text-sm font-medium"
              >
                Nuevo Dispositivo
              </button>
            </div>
          </div>
        </div>
        
        <DeviceTable 
          onDeviceClick={handleDeviceClick}
          onEditDevice={handleEditDevice}
        />
      </div>

      {/* Add/Edit Device Modal - Usar componente unificado */}
      <DeviceFormUnified
        mode="modal"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleDeviceSaved}
      />
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}