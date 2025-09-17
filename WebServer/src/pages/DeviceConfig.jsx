import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Settings, Play, Pause, Wifi, WifiOff, Edit, Trash2 } from 'lucide-react';
import AddRegisterModal from '../components/Devices/AddRegisterModal.jsx';
import AddDeviceModal from '../components/Devices/AddDeviceModal.jsx';
import ConfirmDeleteModal from '../components/Devices/ConfirmDeleteModal.jsx';
import { emsDataManager } from '../utils/EMSDataManager.js';

export default function DeviceConfig() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [registers, setRegisters] = useState([]);
  const [isAddRegisterModalOpen, setIsAddRegisterModalOpen] = useState(false);
  const [isEditDeviceModalOpen, setIsEditDeviceModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [registerToDelete, setRegisterToDelete] = useState(null);
  const [editRegister, setEditRegister] = useState(null); // Nuevo estado para edición de registro
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Cargar dispositivo y sus registros
    const deviceData = emsDataManager.getDeviceById(deviceId);
    if (deviceData) {
      setDevice(deviceData);
      setConnectionStatus(deviceData.status || 'Disconnected');
    }
    
    const deviceRegisters = emsDataManager.getRegistersByDevice(deviceId);
    setRegisters(deviceRegisters);
  }, [deviceId]);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Simular proceso de conexión con delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular probabilidad de conexión exitosa (90% de éxito)
      const connectionSuccess = Math.random() > 0.1;
      
      if (connectionSuccess) {
        setConnectionStatus('Connected');
        if (device) {
          device.status = 'Connected';
          device.lastConnected = new Date().toISOString();
          emsDataManager.updateDevice(deviceId, device);
          setDevice({ ...device });
        }
      } else {
        // Conexión fallida
        alert('Error: No se pudo establecer conexión con el dispositivo. Verifique la dirección IP y que el dispositivo esté accesible.');
      }
    } catch (error) {
      console.error('Error connecting:', error);
      alert('Error durante el proceso de conexión');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setConnectionStatus('Disconnected');
    if (device) {
      device.status = 'Disconnected';
      device.lastDisconnected = new Date().toISOString();
      emsDataManager.updateDevice(deviceId, device);
      setDevice({ ...device });
    }
  };



  const handleEditDevice = (updatedDevice) => {
    const updated = emsDataManager.updateDevice(deviceId, updatedDevice);
    if (updated) {
      setDevice({ ...updated });
      setIsEditDeviceModalOpen(false);
    }
  };

  const validateRegisterData = (registerData, currentEditRegister = null) => {
    const errors = [];

    // Validar TODOS los campos como obligatorios
    if (!registerData.name || registerData.name.trim() === '') {
      errors.push('El nombre del registro es obligatorio');
    }

    if (!registerData.address || isNaN(registerData.address) || registerData.address < 0) {
      errors.push('La dirección debe ser un número mayor o igual a 0');
    }

    if (!registerData.type || registerData.type.trim() === '') {
      errors.push('El tipo de registro es obligatorio');
    }

    if (!registerData.dataType || registerData.dataType.trim() === '') {
      errors.push('El tipo de datos es obligatorio');
    }

    if (!registerData.scale || isNaN(registerData.scale)) {
      errors.push('La escala debe ser un número válido');
    }

    if (!registerData.unit || registerData.unit.trim() === '') {
      errors.push('La unidad de medida es obligatoria');
    }

    // Validar que no exista otro registro con el mismo nombre o dirección en este dispositivo
    // (excluyendo el registro actual en edición)
    const existingRegisters = registers || [];
    const nameExists = existingRegisters.some(register => 
      register.name.toLowerCase() === registerData.name.toLowerCase() &&
      (!currentEditRegister || register.id !== currentEditRegister.id)
    );
    const addressExists = existingRegisters.some(register => 
      register.address === parseInt(registerData.address) &&
      (!currentEditRegister || register.id !== currentEditRegister.id)
    );

    if (nameExists) {
      errors.push('Ya existe un registro con ese nombre en este dispositivo');
    }

    if (addressExists) {
      errors.push('Ya existe un registro con esa dirección en este dispositivo');
    }

    // Validar que la dirección esté dentro del rango permitido del dispositivo
    if (device && device.startAddress !== undefined && device.registers !== undefined) {
      const deviceStartAddress = parseInt(device.startAddress);
      const deviceEndAddress = deviceStartAddress + parseInt(device.registers) - 1;
      const registerAddress = parseInt(registerData.address);

      if (registerAddress < deviceStartAddress || registerAddress > deviceEndAddress) {
        errors.push(`La dirección debe estar entre ${deviceStartAddress} y ${deviceEndAddress} (rango del dispositivo)`);
      }
    }

    return errors;
  };

  const handleAddRegister = async (registerData) => {
    try {
      // Validar datos antes de guardar, pasando el registro en edición para excluirlo de validaciones
      const validationErrors = validateRegisterData(registerData, editRegister);
      
      if (validationErrors.length > 0) {
        alert('Errores de validación:\n' + validationErrors.join('\n'));
        return false; // No cerrar el modal si hay errores
      }

      let success = false;

      if (editRegister) {
        // Estamos editando un registro existente
        console.log('Actualizando registro ID:', editRegister.id, 'con datos:', registerData);
        const updatedRegister = emsDataManager.updateRegister(editRegister.id, registerData);
        console.log('Resultado del update registro:', updatedRegister);
        
        if (updatedRegister) {
          console.log('Registro actualizado exitosamente');
          // Actualizar el estado local
          setRegisters(prev => prev.map(reg => 
            reg.id === editRegister.id ? updatedRegister : reg
          ));
          handleCloseRegisterModal();
          return true;
        } else {
          console.error('Error: updateRegister retornó null');
          alert('Error: No se pudo actualizar el registro. Verifique los datos e intente nuevamente.');
          return false;
        }
      } else {
        // Estamos agregando un nuevo registro
        console.log('Agregando nuevo registro:', registerData);
        const newRegister = emsDataManager.addRegister(deviceId, registerData);
        
        if (newRegister) {
          setRegisters(prev => [...prev, newRegister]);
          handleCloseRegisterModal();
          return true;
        } else {
          alert('Error: No se pudo agregar el registro. Verifique los datos e intente nuevamente.');
          return false;
        }
      }
    } catch (error) {
      console.error('Error al procesar registro:', error);
      alert('Error inesperado al procesar el registro: ' + error.message);
      return false;
    }
  };

  const handleEditRegister = (register) => {
    console.log('Abriendo modal para editar registro:', register);
    setEditRegister(register); // Establecer el registro a editar
    setIsAddRegisterModalOpen(true);
  };

  const handleOpenRegisterModal = () => {
    setEditRegister(null); // Limpiar registro en edición
    setIsAddRegisterModalOpen(true);
  };

  const handleCloseRegisterModal = () => {
    setIsAddRegisterModalOpen(false);
    setEditRegister(null); // Limpiar registro en edición al cerrar
  };

  const handleDeleteRegister = (registerId) => {
    const register = registers.find(reg => reg.id === registerId);
    setRegisterToDelete({ id: registerId, register });
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRegister = () => {
    if (registerToDelete) {
      const deleted = emsDataManager.deleteRegister(registerToDelete.id);
      if (deleted) {
        setRegisters(prev => prev.filter(reg => reg.id !== registerToDelete.id));
      }
      setRegisterToDelete(null);
    }
  };

  if (!device) {
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
  const isConnected = connectionStatus === 'Connected';

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/config-devices')}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            {/* Connection Status Indicator */}
            <div className="flex items-center space-x-2">
              {isConnecting ? (
                <div className="flex items-center space-x-2 bg-blue-900 text-blue-200 px-3 py-2 rounded-lg">
                  <div className="w-4 h-4 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Connecting...</span>
                </div>
              ) : isConnected ? (
                <div className="flex items-center space-x-2 bg-green-900 text-green-200 px-3 py-2 rounded-lg">
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-red-900 text-red-200 px-3 py-2 rounded-lg">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm font-medium">Disconnected</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{device.name}</h1>
              <p className="text-gray-400">Modbus ID: {device.modbusId} | {device.type}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Device Info Card */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Device Information</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={isConnected ? handleDisconnect : handleConnect}
              disabled={isConnecting}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isConnecting
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : isConnected 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              } ${isConnecting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Conectando...</span>
                </>
              ) : isConnected ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Desconectar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Conectar</span>
                </>
              )}
            </button>
            <button
              onClick={() => setIsEditDeviceModalOpen(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Device</span>
            </button>
          </div>
        </div>

        {/* Description Section */}
        {device.description && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <label className="block text-sm text-gray-400 mb-2 font-medium">Description</label>
            <p className="text-white text-sm leading-relaxed">{device.description}</p>
          </div>
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <label className="block text-sm text-gray-400 mb-1 font-medium">Device Name</label>
            <p className="text-white font-semibold">{device.name}</p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <label className="block text-sm text-gray-400 mb-1 font-medium">Device Type</label>
            <p className="text-white">{device.type}</p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <label className="block text-sm text-gray-400 mb-1 font-medium">Modbus ID</label>
            <p className="text-white">{device.modbusId}</p>
          </div>
        </div>

        {/* Communication Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-3">Communication Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <label className="block text-sm text-gray-400 mb-1 font-medium">Protocol</label>
              <p className="text-white">{device.protocol || 'TCP'}</p>
            </div>
            
            {device.protocol === 'RTU' ? (
              <>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm text-gray-400 mb-1 font-medium">Serial Port</label>
                  <p className="text-white">{device.serialPort || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm text-gray-400 mb-1 font-medium">Baud Rate</label>
                  <p className="text-white">{device.baudRate || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm text-gray-400 mb-1 font-medium">Parity</label>
                  <p className="text-white">{device.parity || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm text-gray-400 mb-1 font-medium">Data Bits</label>
                  <p className="text-white">{device.dataBits || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm text-gray-400 mb-1 font-medium">Stop Bits</label>
                  <p className="text-white">{device.stopBits || 'N/A'}</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm text-gray-400 mb-1 font-medium">IP Address</label>
                  <p className="text-white">{device.ip || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm text-gray-400 mb-1 font-medium">Port</label>
                  <p className="text-white">{device.port || 'N/A'}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Register Configuration */}
        {(device.startAddress || device.registers) && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-3">Register Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {device.startAddress && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm text-gray-400 mb-1 font-medium">Start Address</label>
                  <p className="text-white">{device.startAddress}</p>
                </div>
              )}
              
              {device.registers && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm text-gray-400 mb-1 font-medium">Number of Registers</label>
                  <p className="text-white">{device.registers}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Information */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-3">Status Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <label className="block text-sm text-gray-400 mb-1 font-medium">Connection Status</label>
              <p className={`font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {connectionStatus}
              </p>
            </div>
            
            {device.lastConnected && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <label className="block text-sm text-gray-400 mb-1 font-medium">Last Connected</label>
                <p className="text-white text-sm">
                  {new Date(device.lastConnected).toLocaleString()}
                </p>
              </div>
            )}
            
            {device.createdAt && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <label className="block text-sm text-gray-400 mb-1 font-medium">Created</label>
                <p className="text-white text-sm">
                  {new Date(device.createdAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registers Section */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Modbus Registers</h2>
          <button
            onClick={handleOpenRegisterModal}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Register</span>
          </button>
        </div>

        {/* Registers Table */}
        {registers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-gray-400 text-sm">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Data Type</th>
                  <th className="px-4 py-2">Scale</th>
                  <th className="px-4 py-2">Unit</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registers.map((register) => (
                  <tr key={register.id} className="border-b border-gray-700">
                    <td className="px-4 py-3">{register.name}</td>
                    <td className="px-4 py-3">{register.address}</td>
                    <td className="px-4 py-3 capitalize">{register.type}</td>
                    <td className="px-4 py-3">{register.dataType}</td>
                    <td className="px-4 py-3">{register.scale}</td>
                    <td className="px-4 py-3">{register.unit}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditRegister(register)}
                          className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors"
                          title="Edit register"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRegister(register.id)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                          title="Delete register"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No registers configured</p>
            <p className="text-sm">Click "Add Register" to configure Modbus registers</p>
          </div>
        )}
      </div>

      {/* Add/Edit Register Modal */}
      <AddRegisterModal
        isOpen={isAddRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        onSave={handleAddRegister}
        editRegister={editRegister}
      />

      {/* Edit Device Modal */}
      <AddDeviceModal
        isOpen={isEditDeviceModalOpen}
        onClose={() => setIsEditDeviceModalOpen(false)}
        onSave={handleEditDevice}
        editDevice={device}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRegisterToDelete(null);
        }}
        onConfirm={confirmDeleteRegister}
        title="Eliminar Registro"
        message="¿Estás seguro de que quieres eliminar este registro?"
        itemName={registerToDelete?.register?.name || registerToDelete?.register?.address || 'Registro'}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}
