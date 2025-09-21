import React from 'react';
import ModbusRegisterForm from '../components/configregister/ModbusRegisterForm.jsx';
import DeviceHeader from '../components/configDevice/DeviceHeader.jsx';
import DeviceInfoCard from '../components/configDevice/DeviceInfoCard.jsx';
import AddDeviceModal from '../components/configDevice/AddDeviceModal.jsx';
import TableRegister from '../components/configregister/TableRegister.jsx';
import SectionRegister from '../components/configregister/SectionRegister.jsx';
import useEditDevice from '../hooks/device/useEditDevice.js';

const EditModbusDevice = () => {
  const {
    // Datos
    device,
    registers,
    deviceId,
    
    // Estados
    showRegisterForm,
    editingRegister,
    isConnecting,
    showEditDeviceModal,
    
    // Funciones de validación
    isDeviceValid,
    
    // Funciones de navegación
    handleNavigateBack,
    
    // Funciones de dispositivo
    handleEditDevice,
    handleSaveDevice,
    handleCancelEditDevice,
    
    // Funciones de registros
    handleAddRegister,
    handleEditRegister,
    handleDeleteRegister,
    handleSaveRegister,
    handleCancelRegister
  } = useEditDevice();

  // Si no existe el dispositivo, mostrar mensaje
  if (!isDeviceValid()) {
    return <NotfoundDevice handleNavigateBack={handleNavigateBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <DeviceHeader 
          device={device}
          isConnecting={isConnecting}
          onNavigateBack={handleNavigateBack}
        />
        
        {/* Device Info */}
        <DeviceInfoCard 
          device={device}
          onEditDevice={handleEditDevice}
        />

        {/* Registers Section */}
        <SectionRegister
          registers={registers || []}
          handleAddRegister={handleAddRegister}
          handleEditRegister={handleEditRegister}
          handleDeleteRegister={handleDeleteRegister}
          TableRegister={TableRegister}
        />
      </div>

      {/* Register Form Modal */}
      {showRegisterForm && (
        <ModbusRegisterForm 
          idDevice={deviceId}
          isEdit={editingRegister !== null}
          existingData={editingRegister}
          onSave={handleSaveRegister}
          onCancel={handleCancelRegister}
        />
      )}

      {/* Edit Device Modal */}
      {showEditDeviceModal && (
        <AddDeviceModal
          isOpen={showEditDeviceModal}
          onClose={handleCancelEditDevice}
          onSave={handleSaveDevice}
          editDevice={device}
        />
      )}
    </div>
  );
};

export default EditModbusDevice;