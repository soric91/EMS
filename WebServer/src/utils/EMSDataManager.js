/**
 * Gestor de datos local usando localStorage
 * Maneja dispositivos y registros Modbus para el EMS
 */
import { v4 as uuidv4 } from 'uuid';

class EMSDataManager {
  constructor() {
    this.STORAGE_KEYS = {
      DEVICES: 'ems_devices',
      REGISTERS: 'ems_registers'
    };

    // Inicializar datos si no existen
    this.initializeData();
  }

  /**
   * Inicializa los datos por defecto si no existen en localStorage
   */
  initializeData() {
    if (!this.getDevices().length) {
      this.saveDevices([]);
    }
    if (!this.getRegisters().length) {
      this.saveRegisters([]);
    }
  }

  // ===========================================
  // GESTIÓN DE DISPOSITIVOS
  // ===========================================

  /**
   * Obtiene todos los dispositivos
   * @returns {Array} Lista de dispositivos
   */
  getDevices() {
    try {
      const devices = localStorage.getItem(this.STORAGE_KEYS.DEVICES);
      return devices ? JSON.parse(devices) : [];
    } catch (error) {
      console.error('Error getting devices:', error);
      return [];
    }
  }

  /**
   * Guarda la lista completa de dispositivos
   * @param {Array} devices - Lista de dispositivos
   */
  saveDevices(devices) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.DEVICES, JSON.stringify(devices));
    } catch (error) {
      console.error('Error saving devices:', error);
    }
  }

  /**
     * Agrega un nuevo dispositivo
     * @param {Object} device - Datos del dispositivo
     * @returns {Array} infoDeviceModbus
     */

  InfoModbus(device) {
    const cantidad = parseInt(device.modbusId) || 1;

    return Array.from({ length: cantidad }, (_, index) => {
      const id = index + 1;
      return {
        id: id.toString(),
        modbusId: id.toString(),
        startAddress: device.startAddress || "0",
        registers: device.registers || "1"
      };
    });



  }

  /**
   * Agrega un nuevo dispositivo
   * @param {Object} device - Datos del dispositivo
   * @returns {Object} infoDevice
   */

  InfoByprotocol(device) {
    if (device.protocol === 'TCP') {
      return {
        ipAddress: device.ipAddress || '',
        port: device.port || 502
      };
    } else if (device.protocol === 'RTU') {
      return {
        serialPort: device.serialPort || '',
        baudRate: device.baudRate || 9600,
        dataBits: device.dataBits || 8,
        stopBits: device.stopBits || 1,
        parity: device.parity || 'None'

      };
    }
    // Puedes agregar otros protocolos aquí si es necesario
    return {};
  }

  /**
   * Agrega un nuevo dispositivo
   * @param {Object} device - Datos del dispositivo
   * @returns {Object} Dispositivo agregado con ID
   */
  addDevice(device) {
    try {
      const devices = this.getDevices();
      const newDevice = {
        id: uuidv4(), // ID único como UUID string
        status: 'Disconnected',
        lastRead: 'Never',
        deviceType: device.deviceType || 'Unknown',
        deviceName: device.deviceName || `Device-${devices.length + 1}`,
        description: device.description || '',
        protocol: device.protocol || 'TCP',
        ...this.InfoByprotocol(device),
        InfoModbus: this.InfoModbus(device),


        createdAt: new Date().toISOString()
      };

      devices.push(newDevice);
      this.saveDevices(devices);
      return newDevice;
    } catch (error) {
      console.error('Error adding device:', error);
      return null;
    }
  }

  /**
   * Actualiza un dispositivo existente
   * @param {string} deviceId - ID del dispositivo (UUID)
   * @param {Object} updates - Datos a actualizar
   * @returns {Object|null} Dispositivo actualizado o null si no existe
   */
  updateDevice(deviceId, updates) {
    try {
      const devices = this.getDevices();
      // Los dispositivos ahora usan UUID, no convertir a número
      const deviceIndex = devices.findIndex(d => d.id === deviceId);

      if (deviceIndex === -1) {
        console.error('Dispositivo no encontrado con ID:', deviceId);
        return null;
      }

      devices[deviceIndex] = {
        ...devices[deviceIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };


      this.saveDevices(devices);

      return devices[deviceIndex];
    } catch (error) {
      console.error('Error updating device:', error);
      return null;
    }
  }

  /**
   * Elimina un dispositivo
   * @param {string} deviceId - ID del dispositivo
   * @returns {boolean} true si se eliminó correctamente
   */
  deleteDevice(deviceId) {
    try {
      const devices = this.getDevices();
      const filteredDevices = devices.filter(d => d.id !== deviceId);

      // También eliminar registros asociados
      this.deleteRegistersByDevice(deviceId);

      this.saveDevices(filteredDevices);
      return true;
    } catch (error) {
      console.error('Error deleting device:', error);
      return false;
    }
  }

  /**
   * Obtiene un dispositivo por ID
   * @param {string} deviceId - ID del dispositivo (UUID)
   * @returns {Object|null} Dispositivo o null si no existe
   */
  getDeviceById(deviceId) {
    try {
      const devices = this.getDevices();
      // Los dispositivos ahora usan UUID, no convertir a número
      return devices.find(d => d.id === deviceId) || null;
    } catch (error) {
      console.error('Error getting device by ID:', error);
      return null;
    }
  }

  // ===========================================
  // GESTIÓN DE REGISTROS
  // ===========================================

  /**
   * Obtiene todos los registros
   * @returns {Array} Lista de registros
   */
  getRegisters() {
    try {
      const registers = localStorage.getItem(this.STORAGE_KEYS.REGISTERS);
      return registers ? JSON.parse(registers) : [];
    } catch (error) {
      console.error('Error getting registers:', error);
      return [];
    }
  }

  /**
   * Obtiene registros por dispositivo
   * @param {string} deviceId - ID del dispositivo (UUID)
   * @returns {Array} Lista de registros del dispositivo
   */
  getRegistersByDevice(deviceId) {
    try {
      const registers = this.getRegisters();
      // Los dispositivos ahora usan UUID, no convertir a número
      return registers.filter(r => r.deviceId === deviceId);
    } catch (error) {
      console.error('Error getting registers by device:', error);
      return [];
    }
  }

  /**
   * Guarda la lista completa de registros
   * @param {Array} registers - Lista de registros
   */
  saveRegisters(registers) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.REGISTERS, JSON.stringify(registers));
    } catch (error) {
      console.error('Error saving registers:', error);
    }
  }

  /**
   * Agrega un nuevo registro
   * @param {Object} register - Datos del registro
   * @returns {Object} Registro agregado con ID
   */
  addRegister(register) {
    try {
      const registers = this.getRegisters();
      const newRegister = {
        id: uuidv4(), // ID único como UUID string
        deviceId: register.deviceId, // deviceId ahora también es UUID string
        ...register,
        status: 'success',
        createdAt: new Date().toISOString()
      };

      registers.push(newRegister);
      this.saveRegisters(registers);

      // Comentado: Actualizar contador de registros del dispositivo
      // ¿Es realmente necesario mantener un contador en el dispositivo?
      // this.updateDeviceRegisterCount(register.deviceId);

      return newRegister;
    } catch (error) {
      console.error('Error adding register:', error);
      return null;
    }
  }

  /**
   * Actualiza un registro existente
   * @param {string} registerId - ID del registro (UUID)
   * @param {Object} updates - Datos a actualizar
   * @returns {Object|null} Registro actualizado o null si no existe
   */
  updateRegister(registerId, updates) {
    try {
      console.log('EMSDataManager.updateRegister llamado con:', { registerId, updates });
      const registers = this.getRegisters();
      console.log('Registros existentes:', registers);
      // Los registros usan UUID, no convertir a número
      const registerIndex = registers.findIndex(r => r.id === registerId);
      console.log('Índice del registro encontrado:', registerIndex);

      if (registerIndex === -1) {
        console.error('Registro no encontrado con ID:', registerId);
        return null;
      }

      registers[registerIndex] = {
        ...registers[registerIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      console.log('Registro actualizado:', registers[registerIndex]);
      this.saveRegisters(registers);
      console.log('Registros guardados en localStorage');
      return registers[registerIndex];
    } catch (error) {
      console.error('Error updating register:', error);
      return null;
    }
  }

  /**
   * Elimina un registro
   * @param {string} registerId - ID del registro (UUID)
   * @returns {boolean} true si se eliminó correctamente
   */
  deleteRegister(registerId) {
    try {
      const registers = this.getRegisters();
      // Los registros usan UUID, no convertir a número
      const register = registers.find(r => r.id === registerId);
      if (!register) return false;

      const filteredRegisters = registers.filter(r => r.id !== registerId);
      this.saveRegisters(filteredRegisters);

      // Actualizar contador de registros del dispositivo (opcional)
      // this.updateDeviceRegisterCount(register.deviceId);

      return true;
    } catch (error) {
      console.error('Error deleting register:', error);
      return false;
    }
  }

  /**
   * Elimina todos los registros de un dispositivo
   * @param {string} deviceId - ID del dispositivo (UUID)
   */
  deleteRegistersByDevice(deviceId) {
    try {
      const registers = this.getRegisters();
      // Los dispositivos ahora usan UUID, no convertir a número
      const filteredRegisters = registers.filter(r => r.deviceId !== deviceId);
      this.saveRegisters(filteredRegisters);
    } catch (error) {
      console.error('Error deleting registers by device:', error);
    }
  }

  /**
   * Actualiza el contador de registros activos de un dispositivo
   * @param {string} deviceId - ID del dispositivo (UUID)
   */
  updateDeviceRegisterCount(deviceId) {
    try {
      const registers = this.getRegistersByDevice(deviceId);
      // deviceId ahora es UUID, no convertir a número
      this.updateDevice(deviceId, {
        registers: registers.length,
        activeRegisters: registers.length
      });
    } catch (error) {
      console.error('Error updating device register count:', error);
    }
  }

  // ===========================================
  // UTILIDADES Y EXPORTACIÓN
  // ===========================================

  /**
   * Exporta todos los datos como JSON
   * @returns {Object} Objeto con todos los datos
   */
  exportData() {
    return {
      devices: this.getDevices(),
      registers: this.getRegisters(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Importa datos desde un objeto JSON
   * @param {Object} data - Datos a importar
   * @returns {boolean} true si se importó correctamente
   */
  importData(data) {
    try {
      if (data.devices && Array.isArray(data.devices)) {
        this.saveDevices(data.devices);
      }
      if (data.registers && Array.isArray(data.registers)) {
        this.saveRegisters(data.registers);
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Limpia todos los datos almacenados
   */
  clearAllData() {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.DEVICES);
      localStorage.removeItem(this.STORAGE_KEYS.REGISTERS);
      this.initializeData();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  /**
   * Obtiene estadísticas de los datos
   * @returns {Object} Estadísticas
   */
  getStats() {
    try {
      const devices = this.getDevices();
      const registers = this.getRegisters();

      return {
        totalDevices: devices.length,
        connectedDevices: devices.filter(d => d.status === 'Connected').length,
        totalRegisters: registers.length,
        activeRegisters: registers.filter(r => r.status === 'success').length,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return { totalDevices: 0, connectedDevices: 0, totalRegisters: 0, activeRegisters: 0 };
    }
  }
}

// Crear instancia global
export const emsDataManager = new EMSDataManager();

// Exportar también la clase para casos específicos
export default EMSDataManager;
