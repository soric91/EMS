import { useParams, useNavigate } from 'react-router-dom';
import AddRegisterModal from '../components/Devices/AddRegisterModal.jsx';
import AddDeviceModal from '../components/Devices/AddDeviceModal.jsx';
import ConfirmDeleteModal from '../components/Devices/ConfirmDeleteModal.jsx';
import DeviceHeader from '../components/Devices/DeviceHeader.jsx';
import DeviceInfoCard from '../components/Devices/DeviceInfoCard.jsx';
import RegistersSection from '../components/Devices/RegistersSection.jsx';
import { useDeviceConfig } from '../hooks/useDeviceConfig.js';
import { useDeviceRegisters } from '../hooks/useDeviceRegisters.js';
import { useModalState } from '../hooks/useModalState.js';
import { showError } from '../components/ui/ErrorHandler.jsx';

export default function DeviceConfig() {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  // Custom hooks para manejar la lógica
  const deviceConfig = useDeviceConfig(deviceId);
  const deviceRegisters = useDeviceRegisters(deviceId, deviceConfig.device);
  const modalState = useModalState();

  // Handlers para el dispositivo
  const handleEditDevice = async (updatedDevice) => {
    const success = deviceConfig.updateDevice(updatedDevice);
    if (success) {
      modalState.closeEditDeviceModal();
    } else {
      showError('No se pudo actualizar el dispositivo');
    }
  };

  const handleConnect = async () => {
    const result = await deviceConfig.handleConnect();
    if (!result.success) {
      showError(result.error);
    }
  };

  // Handlers para registros
  const handleAddRegister = async (registerData) => {
    const result = await deviceRegisters.handleAddRegister(registerData);
    if (result.success) {
      modalState.closeAddRegisterModal();
      deviceRegisters.clearEditRegister();
      return true;
    } else {
      showError(result.errors);
      return false;
    }
  };

  const handleEditRegister = (register) => {
    deviceRegisters.handleEditRegister(register);
    modalState.openAddRegisterModal();
  };

  const handleOpenRegisterModal = () => {
    deviceRegisters.clearEditRegister();
    modalState.openAddRegisterModal();
  };

  const handleCloseRegisterModal = () => {
    modalState.closeAddRegisterModal();
    deviceRegisters.clearEditRegister();
  };

  const handleDeleteRegister = (registerId) => {
    const register = deviceRegisters.registers.find(reg => reg.id === registerId);
    modalState.openDeleteModal(registerId, register);
  };

  const confirmDeleteRegister = () => {
    if (modalState.registerToDelete) {
      const success = deviceRegisters.handleDeleteRegister(modalState.registerToDelete.id);
      if (!success) {
        showError('No se pudo eliminar el registro');
      }
      modalState.closeDeleteModal();
    }
  };

  if (!deviceConfig.device) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <div className="text-center">
          <p>Dispositivo no encontrado</p>
          <button 
            onClick={() => navigate('/config-devices')}
            className="mt-4 px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500"
          >
            Volver a dispositivos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <DeviceHeader 
        device={deviceConfig.device}
        connectionStatus={deviceConfig.connectionStatus}
        isConnecting={deviceConfig.isConnecting}
        onNavigateBack={() => navigate('/config-devices')}
      />

      <DeviceInfoCard 
        device={deviceConfig.device}
        isConnected={deviceConfig.isConnected}
        isConnecting={deviceConfig.isConnecting}
        onConnect={handleConnect}
        onDisconnect={deviceConfig.handleDisconnect}
        onEditDevice={modalState.openEditDeviceModal}
      />

      <RegistersSection 
        registers={deviceRegisters.registers}
        onAddRegister={handleOpenRegisterModal}
        onEditRegister={handleEditRegister}
        onDeleteRegister={handleDeleteRegister}
      />

      {/* Modals */}
      <AddRegisterModal
        isOpen={modalState.isAddRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        onSave={handleAddRegister}
        editRegister={deviceRegisters.editRegister}
      />

      <AddDeviceModal
        isOpen={modalState.isEditDeviceModalOpen}
        onClose={modalState.closeEditDeviceModal}
        onSave={handleEditDevice}
        editDevice={deviceConfig.device}
      />

      <ConfirmDeleteModal
        isOpen={modalState.isDeleteModalOpen}
        onClose={modalState.closeDeleteModal}
        onConfirm={confirmDeleteRegister}
        title="Eliminar Registro"
        message="¿Estás seguro de que quieres eliminar este registro?"
        itemName={modalState.registerToDelete?.register?.name || modalState.registerToDelete?.register?.address || 'Registro'}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
