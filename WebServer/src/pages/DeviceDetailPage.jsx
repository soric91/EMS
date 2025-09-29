import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Settings, ArrowLeft, Plus } from 'lucide-react';
import ModbusRegisterForm from '../components/configregister/ModbusRegisterForm.jsx';
import DeviceHeader from '../components/configDevice/DeviceHeader.jsx';
import DeviceInfoCard from '../components/configDevice/DeviceInfoCard.jsx';
import DeviceFormUnified from '../components/configDevice/DeviceFormUnified.jsx';
import TableRegister from '../components/configregister/TableRegister.jsx';
import SectionRegister from '../components/configregister/SectionRegister.jsx';
import NotfoundDevice from '../components/configDevice/NotfoundDevice.jsx';
import useEditDevice from '../hooks/device/useEditDevice.js';

/**
 * Página de detalle de dispositivo - versión mejorada de EditDeviceModbus
 * Mantiene funcionalidad existente pero con mejor UX y navegación
 */
const DeviceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('detail'); // 'detail' | 'edit' | 'registers'
  
  const {
    // Datos
    device,
    registers,
    deviceId,
    
    // Estados
    showRegisterForm,
    editingRegister,
    isConnecting,
    
    // Funciones de validación
    isDeviceValid,
    
    // Funciones de navegación
    handleNavigateBack,
    
    // Funciones de registros
    handleAddRegister,
    handleEditRegister,
    handleDeleteRegister,
    handleSaveRegister,
    handleCancelRegister,
    
    // Funciones de estado
    setShowRegisterForm,
    setEditingRegister
  } = useEditDevice();

  // Si no existe el dispositivo, mostrar mensaje
  if (!isDeviceValid()) {
    return <NotfoundDevice handleNavigateBack={() => navigate('/devices')} />;
  }

  const handleEditDevice = () => {
    setViewMode('edit');
  };

  const handleSaveDevice = (deviceData) => {
    // Aquí iría la lógica de guardado
    console.log('Saving device:', deviceData);
    setViewMode('detail');
  };

  const handleCancelEdit = () => {
    setViewMode('detail');
  };

  const handleManageRegisters = () => {
    setViewMode('registers');
  };

  // Breadcrumbs mejorados
  const renderBreadcrumbs = () => (
    <nav className="flex items-center space-x-2 text-sm text-zinc-400 mb-6">
      <button
        onClick={() => navigate('/devices')}
        className="hover:text-white transition-colors"
      >
        Dispositivos
      </button>
      <span>/</span>
      <span className="text-white">{device.deviceName}</span>
      {viewMode === 'edit' && (
        <>
          <span>/</span>
          <span className="text-blue-400">Editar</span>
        </>
      )}
      {viewMode === 'registers' && (
        <>
          <span>/</span>
          <span className="text-green-400">Registros Modbus</span>
        </>
      )}
    </nav>
  );

  // Tabs de navegación
  const renderTabs = () => (
    <div className="flex items-center space-x-1 mb-6">
      <button
        onClick={() => setViewMode('detail')}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          viewMode === 'detail'
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-700/30'
        }`}
      >
        Detalles
      </button>
      <button
        onClick={() => setViewMode('registers')}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          viewMode === 'registers'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-700/30'
        }`}
      >
        Registros Modbus ({registers?.length || 0})
      </button>
    </div>
  );

  // Mostrar formulario de edición en modo página completa
  if (viewMode === 'edit') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6">
        <div className="container mx-auto px-6 max-w-6xl">
          {renderBreadcrumbs()}
          <DeviceFormUnified
            mode="page"
            device={device}
            onSave={handleSaveDevice}
            onClose={handleCancelEdit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6">
      <div className="container mx-auto px-6 max-w-6xl">
        {renderBreadcrumbs()}
        
        {/* Header mejorado con acciones */}
        <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-700/50 p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/devices')}
                className="p-3 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-700/50 transition-all duration-200 hover:scale-105 border border-zinc-600/30 hover:border-zinc-500/50"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                  {device.deviceName}
                </h1>
                <p className="text-zinc-400 mt-1">{device.description || 'Sin descripción'}</p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleManageRegisters}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-600/90 to-emerald-600/90 hover:from-green-500/90 hover:to-emerald-500/90 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/25 hover:scale-105 border border-green-500/30 hover:border-green-400/50"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Gestionar Registros</span>
              </button>
              
              <button
                onClick={handleEditDevice}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-500/90 hover:to-indigo-500/90 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105 border border-blue-500/30 hover:border-blue-400/50"
              >
                <Edit className="w-4 h-4" />
                <span className="font-medium">Editar Dispositivo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {renderTabs()}

        {/* Content based on view mode */}
        {viewMode === 'detail' && (
          <>
            {/* Device Info */}
            <DeviceInfoCard 
              device={device}
              onEditDevice={handleEditDevice}
            />

            {/* Quick Registers Preview */}
            <div className="bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 backdrop-blur-sm rounded-2xl border border-zinc-700/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Registros Modbus</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-zinc-400">
                    {registers?.length || 0} registro(s) configurado(s)
                  </span>
                  <button
                    onClick={handleManageRegisters}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/30 rounded-lg transition-all duration-200 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Gestionar</span>
                  </button>
                </div>
              </div>
              
              {registers && registers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {registers.slice(0, 6).map((register) => (
                    <div key={register.id} className="bg-zinc-800/30 border border-zinc-700/30 rounded-lg p-4">
                      <div className="text-sm text-zinc-400">Modbus ID</div>
                      <div className="text-white font-medium">{register.modbusId}</div>
                      <div className="text-xs text-zinc-500 mt-1">
                        Addr: {register.startAddress}, Regs: {register.registers}
                      </div>
                    </div>
                  ))}
                  {registers.length > 6 && (
                    <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-lg p-4 flex items-center justify-center">
                      <div className="text-zinc-400 text-sm">
                        +{registers.length - 6} más...
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-zinc-400 mb-2">No hay registros configurados</div>
                  <button
                    onClick={handleAddRegister}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Agregar primer registro
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {viewMode === 'registers' && (
          <SectionRegister
            registers={registers || []}
            handleAddRegister={handleAddRegister}
            handleEditRegister={handleEditRegister}
            handleDeleteRegister={handleDeleteRegister}
            TableRegister={TableRegister}
          />
        )}

        {/* Register Form Modal - Específico para este dispositivo */}
        {showRegisterForm && (
          <ModbusRegisterForm 
            idDevice={deviceId || id}
            device={device}
            isEdit={editingRegister !== null}
            existingData={editingRegister}
            onSave={handleSaveRegister}
            onCancel={handleCancelRegister}
            specificDevice={true} // Flag para indicar que es específico del dispositivo
          />
        )}
      </div>
    </div>
  );
};

export default DeviceDetailPage;