import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Edit2, Trash2, Plus, Wifi, WifiOff } from 'lucide-react';
import ModbusRegisterForm from '../components/configregister/ModbusRegisterForm.jsx';
import DeviceHeader from '../components/Devices/DeviceHeader.jsx';
import { useGlobalDevice } from '../context/GlobalDevice.jsx';
import { useNavigate } from 'react-router-dom';
import DeviceInfoCard from '../components/Devices/DeviceInfoCard.jsx';
import AddDeviceModal from '../components/Devices/AddDeviceModal.jsx';
import TableRegister from '../components/configregister/TableRegister.jsx';

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
      console.log('Saving device data:', deviceData);
      
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
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Modbus Registers</h2>
              <p className="text-gray-400 text-sm">Configure and manage device registers</p>
            </div>
            <button
              onClick={handleAddRegister}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105 border border-blue-500/20"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Register</span>
            </button>
          </div>

          {/* Registers Table */}
          {registers && registers.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{registers.length} register{registers.length !== 1 ? 's' : ''} configured</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Input</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Holding</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span>Coil</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Discrete</span>
                  </div>
                </div>
              </div>
              <TableRegister
                registers={registers}
                handleEditRegister={handleEditRegister}
                handleDeleteRegister={handleDeleteRegister}
              />
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No registers configured</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Start by adding your first Modbus register to begin monitoring device data.
                </p>
              </div>
              <button
                onClick={handleAddRegister}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105 border border-blue-500/20 font-medium"
              >
                Add First Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Register Form Modal */}
      {showRegisterForm && (
        <ModbusRegisterForm
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