import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeviceTable from "../components/Devices/DeviceTable.jsx";
import StatsCard from "../components/Devices/StatsCard.jsx";
import AddDeviceModal from "../components/Devices/AddDeviceModal.jsx";
import ConfirmDeleteModal from "../components/Devices/ConfirmDeleteModal.jsx";
import { emsDataManager } from "../utils/EMSDataManager.js";
import { addConfigParamsModbus } from "../api/apiModbus.js";

export default function DeviceManagement() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [editDevice, setEditDevice] = useState(null); // Nuevo estado para edición
  const [devices, setDevices] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false); // Estado para sincronización
  const [stats, setStats] = useState({
    totalDevices: 0,
    connectedDevices: 0,
    totalRegisters: 0,
    activeRegisters: 0
  });

  // Cargar datos al montar el componente y cuando cambie la ubicación
  useEffect(() => {
    loadDevices();
    loadStats();
  }, []);

  // Recargar datos cuando la página regane el foco (útil cuando se navega de vuelta desde DeviceConfig)
  useEffect(() => {
    const handleFocus = () => {
      loadDevices();
      loadStats();
    };

    window.addEventListener('focus', handleFocus);
    
    // También escuchar cambios de visibilidad
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadDevices();
        loadStats();
      }
    };

    // Escuchar cambios en el storage (cuando se elimina desde DeviceConfig)
    const handleStorageChange = () => {
      loadDevices();
      loadStats();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadDevices = () => {
    const loadedDevices = emsDataManager.getDevices();
    setDevices(loadedDevices);
  };

  const loadStats = () => {
    const currentStats = emsDataManager.getStats();
    setStats(currentStats);
  };

  const validateDeviceData = (deviceData, currentEditDevice = null) => {
    const errors = [];

    // Validar TODOS los campos como obligatorios
    if (!deviceData.name || deviceData.name.trim() === '') {
      errors.push('El nombre del dispositivo es obligatorio');
    }

    if (!deviceData.type || deviceData.type.trim() === '') {
      errors.push('El tipo de dispositivo es obligatorio');
    }

    if (!deviceData.protocol || deviceData.protocol.trim() === '') {
      errors.push('El protocolo es obligatorio');
    }

    if (!deviceData.modbusId || isNaN(deviceData.modbusId) || deviceData.modbusId < 1 || deviceData.modbusId > 247) {
      errors.push('ID Modbus debe ser un número entre 1 y 247');
    }

    if (!deviceData.startAddress || isNaN(deviceData.startAddress) || deviceData.startAddress < 0) {
      errors.push('La dirección inicial debe ser un número mayor o igual a 0');
    }

    if (!deviceData.registers || isNaN(deviceData.registers) || deviceData.registers < 1) {
      errors.push('El número de registros debe ser mayor a 0');
    }

    if (!deviceData.description || deviceData.description.trim() === '') {
      errors.push('La descripción es obligatoria');
    }

    // Validar que no exista otro dispositivo con el mismo nombre o Modbus ID (excluyendo el dispositivo actual en edición)
    const existingDevices = emsDataManager.getDevices();
    const nameExists = existingDevices.some(device => 
      device.name.toLowerCase() === deviceData.name.toLowerCase() &&
      (!currentEditDevice || device.id !== currentEditDevice.id)
    );
    const modbusIdExists = existingDevices.some(device => 
      device.modbusId === parseInt(deviceData.modbusId) &&
      (!currentEditDevice || device.id !== currentEditDevice.id)
    );

    if (nameExists) {
      errors.push('Ya existe un dispositivo con ese nombre');
    }

    if (modbusIdExists) {
      errors.push('Ya existe un dispositivo con ese ID Modbus');
    }

    // Validaciones específicas según protocolo
    if (deviceData.protocol === 'TCP') {
      if (!deviceData.ip || deviceData.ip.trim() === '') {
        errors.push('La dirección IP es obligatoria para protocolo TCP');
      } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(deviceData.ip)) {
        errors.push('Formato de IP inválido');
      }

      if (!deviceData.port || isNaN(deviceData.port) || deviceData.port < 1 || deviceData.port > 65535) {
        errors.push('Puerto debe ser un número entre 1 y 65535');
      }

      // Validar que no exista otro dispositivo TCP con la misma IP:Puerto (excluyendo el dispositivo actual)
      const tcpExists = existingDevices.some(device => 
        device.protocol === 'TCP' && 
        device.ip === deviceData.ip && 
        device.port === parseInt(deviceData.port) &&
        (!currentEditDevice || device.id !== currentEditDevice.id)
      );

      if (tcpExists) {
        errors.push('Ya existe un dispositivo TCP con esa IP y puerto');
      }
    } else if (deviceData.protocol === 'RTU') {
      if (!deviceData.serialPort || deviceData.serialPort.trim() === '') {
        errors.push('El puerto serial es obligatorio para protocolo RTU');
      }

      if (!deviceData.baudRate || isNaN(deviceData.baudRate) || deviceData.baudRate <= 0) {
        errors.push('La velocidad de baudios debe ser un número válido mayor a 0');
      }

      if (!deviceData.parity || deviceData.parity.trim() === '') {
        errors.push('La paridad es obligatoria');
      }

      if (!deviceData.dataBits || isNaN(deviceData.dataBits) || ![7, 8].includes(parseInt(deviceData.dataBits))) {
        errors.push('Los bits de datos deben ser 7 u 8');
      }

      if (!deviceData.stopBits || isNaN(deviceData.stopBits) || ![1, 2].includes(parseInt(deviceData.stopBits))) {
        errors.push('Los bits de parada deben ser 1 o 2');
      }

      // Validar que no exista otro dispositivo RTU con el mismo puerto serial (excluyendo el dispositivo actual)
      const rtuExists = existingDevices.some(device => 
        device.protocol === 'RTU' && 
        device.serialPort === deviceData.serialPort &&
        (!currentEditDevice || device.id !== currentEditDevice.id)
      );

      if (rtuExists) {
        errors.push('Ya existe un dispositivo RTU con ese puerto serial');
      }
    }

    return errors;
  };

  const handleSaveDevice = async (deviceData) => {
    try {
      // Validar datos antes de guardar, pasando el dispositivo en edición para excluirlo de validaciones
      const validationErrors = validateDeviceData(deviceData, editDevice);
      
      if (validationErrors.length > 0) {
        alert('Errores de validación:\n' + validationErrors.join('\n'));
        return false; // No cerrar el modal si hay errores
      }

      let success = false;
      
      if (editDevice) {
        // Estamos editando un dispositivo existente
       
        const updatedDevice = emsDataManager.updateDevice(editDevice.id, deviceData);

        
        if (updatedDevice) {
          loadDevices();
          loadStats();
          handleCloseModal();
          return true;
        } else {
          console.error('Error: updateDevice retornó null');
          alert('Error: No se pudo actualizar el dispositivo. Verifique los datos e intente nuevamente.');
          return false;
        }
      } else {
        // Estamos agregando un nuevo dispositivo
    
        const addedDevice = emsDataManager.addDevice(deviceData);
        
        if (addedDevice) {
          loadDevices();
          loadStats();
          handleCloseModal();
          return true;
        } else {
          alert('Error: No se pudo agregar el dispositivo. Verifique los datos e intente nuevamente.');
          return false;
        }
      }
    } catch (error) {
      console.error('Error al guardar dispositivo:', error);
      alert('Error inesperado al guardar el dispositivo: ' + error.message);
      return false;
    }
  };

  const handleConfigDevice = (device, index) => {
    // Navegar a página de configuración de dispositivo
    navigate(`/device-config/${device.id}`);
  };

  const handleOpenModal = () => {
    setEditDevice(null); // Limpiar dispositivo en edición
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditDevice(null); // Limpiar dispositivo en edición al cerrar
  };

  const handleEditDevice = (device) => {
    console.log('Editando dispositivo:', device); // Debug
    setEditDevice(device); // Establecer el dispositivo a editar
    setIsModalOpen(true); // Abrir el modal
  };

  const handleConnectDevice = (deviceId) => {
    // Lógica para conectar dispositivo
    const device = emsDataManager.getDeviceById(deviceId);
    if (device) {
      device.status = 'Connected';
      emsDataManager.updateDevice(deviceId, device);
      loadDevices();
      loadStats();
    }
  };

  const handleDisconnectDevice = (deviceId) => {
    // Lógica para desconectar dispositivo
    const device = emsDataManager.getDeviceById(deviceId);
    if (device) {
      device.status = 'Disconnected';
      emsDataManager.updateDevice(deviceId, device);
      loadDevices();
      loadStats();
    }
  };

  const handleDeleteDevice = (deviceId) => {
    const device = emsDataManager.getDeviceById(deviceId);
    setDeviceToDelete({ id: deviceId, device });
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteDevice = () => {
    if (deviceToDelete) {
      const deleted = emsDataManager.deleteDevice(deviceToDelete.id);
      if (deleted) {
        loadDevices();
        loadStats();
      }
      setDeviceToDelete(null);
    }
  };

  const handleSyncDevices = async () => {
    setIsSyncing(true);
    
    try {
      // Obtener el token JWT del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token de autenticación no encontrado. Por favor, inicie sesión nuevamente.');
        return;
      }

      // Obtener todos los dispositivos Modbus del localStorage
      const localDevices = emsDataManager.getDevices();
      
      console.log('Dispositivos en localStorage:', localDevices);
      
      if (localDevices.length === 0) {
        alert('No hay dispositivos en el localStorage para sincronizar.');
        return;
      }

      let syncSuccessCount = 0;
      let syncErrorCount = 0;
      const errors = [];

      // Sincronizar cada dispositivo
      for (const device of localDevices) {
        try {
          console.log('Sincronizando dispositivo:', device);
          
          // Preparar los parámetros exactos como se especifica en el payload
          const devicePayload = {
            id: device.id,
            name: device.name,
            type: device.type,
            protocol: device.protocol,
            ip: device.ip || "",
            port: device.port || "",
            serialPort: device.serialPort || "",
            baudRate: parseInt(device.baudRate),
            parity: device.parity,
            dataBits: parseInt(device.dataBits),
            stopBits: parseInt(device.stopBits),
            modbusId: parseInt(device.modbusId),
            startAddress: parseInt(device.startAddress),
            registers: parseInt(device.registers)
          };

          console.log('Payload enviado:', devicePayload);

          // Llamar al API para agregar la configuración
          await addConfigParamsModbus(devicePayload, token);
          syncSuccessCount++;
          
        } catch (error) {
          console.error(`Error sincronizando dispositivo ${device.name}:`, error);
          syncErrorCount++;
          errors.push(`${device.name}: ${error.response?.data?.detail || error.message}`);
        }
      }

      // Mostrar resultado de la sincronización
      if (syncSuccessCount > 0) {
        const message = `Sincronización completada:\n✓ ${syncSuccessCount} dispositivos sincronizados correctamente${syncErrorCount > 0 ? `\n✗ ${syncErrorCount} dispositivos con errores` : ''}`;
        alert(message);
        
        if (errors.length > 0) {
          console.error('Errores de sincronización:', errors);
        }
      } else {
        alert('No se pudo sincronizar ningún dispositivo:\n' + errors.join('\n'));
      }

    } catch (error) {
      console.error('Error general en la sincronización:', error);
      alert('Error inesperado durante la sincronización: ' + error.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 text-white bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Device Management</h1>
        <div className="flex gap-3">
          <button 
            onClick={handleSyncDevices}
            disabled={isSyncing}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSyncing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sincronizando...
              </>
            ) : (
              '🔄 Sincronizar Device'
            )}
          </button>
          <button 
            onClick={handleOpenModal}
            className="px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors"
          >
            + Add Device
          </button>
        </div>
      </div>

      <DeviceTable 
        devices={devices} 
        onConfigDevice={handleConfigDevice}
        onConnect={handleConnectDevice}
        onDisconnect={handleDisconnectDevice}
        onDelete={handleDeleteDevice}
        onEdit={handleEditDevice}
      />

      <div className="grid grid-cols-3 gap-4">
        <StatsCard 
          label="Total Devices" 
          value={stats.totalDevices.toString()} 
          color="text-emerald-400" 
        />
        <StatsCard 
          label="Connected" 
          value={stats.connectedDevices.toString()} 
          color="text-emerald-400" 
        />
        <StatsCard 
          label="Total Registers" 
          value={stats.totalRegisters.toString()} 
          color="text-yellow-400" 
        />
      </div>

      {/* Modal para añadir/editar dispositivo */}
      <AddDeviceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDevice}
        editDevice={editDevice}
      />

      {/* Modal de confirmación para eliminar dispositivo */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeviceToDelete(null);
        }}
        onConfirm={confirmDeleteDevice}
        title="Eliminar Dispositivo"
        message="¿Estás seguro de que quieres eliminar este dispositivo?"
        itemName={deviceToDelete?.device?.name || 'Dispositivo'}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
}