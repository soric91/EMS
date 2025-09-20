import { useParams } from 'react-router-dom';
import { useState } from 'react';
// import { Edit2, Trash2, Plus, Wifi, WifiOff } from 'lucide-react';
import ModbusRegisterForm from '../components/configregister/ModbusRegisterForm.jsx';
import DeviceHeader from '../components/Devices/DeviceHeader.jsx';
import { useGlobalDevice } from '../context/GlobalDevice.jsx';
import { useNavigate } from 'react-router-dom';
import DeviceInfoCard from '../components/configDevice/DeviceInfoCard.jsx';
import AddDeviceModal from '../components/configDevice/AddDeviceModal.jsx';
import TableRegister from '../components/configregister/TableRegister.jsx';
import SectionRegister from '../components/configregister/SectionRegister.jsx';

const EditModbusDevice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getDeviceById, getRegistersByDevice, updateDevice, deleteRegister, addRegister, updateRegister } = useGlobalDevice();
  
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [editingRegister, setEditingRegister] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showEditDeviceModal, setShowEditDeviceModal] = useState(false);
  
  const device = getDeviceById(id);
  const registers = getRegistersByDevice(id);

  // Si no existe el dispositivo, mostrar mensaje
  if (!device || Object.keys(device).length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Device Not Found</h1>
            <p className="text-gray-400 mb-6">The device you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/devices')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Back to Devices
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleEditDevice = () => {
    setShowEditDeviceModal(true);
  };

  const handleSaveDevice = async (deviceData) => {
    try {
  
      
      // Actualizar el dispositivo
      const success = await updateDevice(id, deviceData);
      
      if (success !== false) {
        setShowEditDeviceModal(false);
        // Opcional: mostrar mensaje de éxito
        alert('Dispositivo actualizado correctamente');
        return true;
      } else {
        alert('Error al actualizar el dispositivo');
        return false;
      }
    } catch (error) {
      console.error('Error updating device:', error);
      alert('Error al actualizar el dispositivo');
      return false;
    }
  };

  const handleCancelEditDevice = () => {
    setShowEditDeviceModal(false);
  };

  const handleAddRegister = () => {
    setEditingRegister(null);
    setShowRegisterForm(true);
  };

  const handleEditRegister = (register) => {
    setEditingRegister(register);
    setShowRegisterForm(true);
  };

  const handleDeleteRegister = (registerId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      deleteRegister(registerId);
    }
  };

  const handleSaveRegister = async (registerData) => {
    try {
      // Agregar deviceId al registro
      const registerWithDevice = {
        ...registerData,
        deviceId: id
      };

      if (editingRegister) {
        // Editar registro existente
        await updateRegister(editingRegister.id, registerWithDevice);
      } else {
        // Agregar nuevo registro
        await addRegister(registerWithDevice);
      }

      setShowRegisterForm(false);
      setEditingRegister(null);
    } catch (error) {
      console.error('Error saving register:', error);
      alert('Error al guardar el registro');
    }
  };

  const handleCancelRegister = () => {
    setShowRegisterForm(false);
    setEditingRegister(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <DeviceHeader 
          device={device}
          isConnecting={isConnecting}
          onNavigateBack={() => navigate('/devices')}
        />
        
        {/* Device Info */}
        <DeviceInfoCard 
          device={device}
          onEditDevice={handleEditDevice}
        />

        {/* Registers Section */}
        <SectionRegister
          registers={device.registers}
          handleAddRegister={handleAddRegister}
          handleEditRegister={handleEditRegister}
          handleDeleteRegister={handleDeleteRegister}
          TableRegister={TableRegister}
        />
      </div>

      {/* Register Form Modal */}
      {showRegisterForm && (
        <ModbusRegisterForm idDevice={id} // Pass the device ID as a prop
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