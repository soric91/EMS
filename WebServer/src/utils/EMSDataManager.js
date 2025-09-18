/**
 * Gestor de datos local usando localStorage
 * Maneja dispositivos y registros Modbus para el EMS
 */
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
   * @returns {Object} Dispositivo agregado con ID
   */
  addDevice(device) {
    try {
      const devices = this.getDevices();
      const newDevice = {
        id: Date.now(), // ID único basado en timestamp
        ...device,
        status: 'Disconnected',
        lastRead: 'Never',
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
   * @param {number} deviceId - ID del dispositivo
   * @param {Object} updates - Datos a actualizar
   * @returns {Object|null} Dispositivo actualizado o null si no existe
   */
  updateDevice(deviceId, updates) {
    try {
  
      const devices = this.getDevices();
     
      // Convertir deviceId a número para comparación correcta
      const numericDeviceId = parseInt(deviceId);
   
      const deviceIndex = devices.findIndex(d => d.id === numericDeviceId);
     
      if (deviceIndex === -1) {
        console.error('Dispositivo no encontrado con ID:', numericDeviceId);
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
   * @param {number} deviceId - ID del dispositivo
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
   * @param {number} deviceId - ID del dispositivo
   * @returns {Object|null} Dispositivo o null si no existe
   */
  getDeviceById(deviceId) {
    try {
      const devices = this.getDevices();
      return devices.find(d => d.id === parseInt(deviceId)) || null;
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
   * @param {number} deviceId - ID del dispositivo
   * @returns {Array} Lista de registros del dispositivo
   */
  getRegistersByDevice(deviceId) {
    try {
      const registers = this.getRegisters();
      return registers.filter(r => r.deviceId === parseInt(deviceId));
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
   * @param {number} deviceId - ID del dispositivo
   * @param {Object} register - Datos del registro
   * @returns {Object} Registro agregado con ID
   */
  addRegister(deviceId, register) {
    try {
      const registers = this.getRegisters();
      const newRegister = {
        id: Date.now(), // ID único
        deviceId: parseInt(deviceId),
        ...register,
        status: 'success',
        lastValue: '0',
        lastUpdate: 'Never',
        createdAt: new Date().toISOString()
      };
      
      registers.push(newRegister);
      this.saveRegisters(registers);
      
      // Actualizar contador de registros del dispositivo
      this.updateDeviceRegisterCount(deviceId);
      
      return newRegister;
    } catch (error) {
      console.error('Error adding register:', error);
      return null;
    }
  }

  /**
   * Actualiza un registro existente
   * @param {number} registerId - ID del registro
   * @param {Object} updates - Datos a actualizar
   * @returns {Object|null} Registro actualizado o null si no existe
   */
  updateRegister(registerId, updates) {
    try {
      console.log('EMSDataManager.updateRegister llamado con:', { registerId, updates });
      const registers = this.getRegisters();
      console.log('Registros existentes:', registers);
      // Convertir registerId a número para comparación correcta
      const numericRegisterId = parseInt(registerId);
      console.log('registerId convertido a número:', numericRegisterId);
      const registerIndex = registers.findIndex(r => r.id === numericRegisterId);
      console.log('Índice del registro encontrado:', registerIndex);
      
      if (registerIndex === -1) {
        console.error('Registro no encontrado con ID:', numericRegisterId);
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
   * @param {number} registerId - ID del registro
   * @returns {boolean} true si se eliminó correctamente
   */
  deleteRegister(registerId) {
    try {
      const registers = this.getRegisters();
      const register = registers.find(r => r.id === registerId);
      if (!register) return false;
      
      const filteredRegisters = registers.filter(r => r.id !== registerId);
      this.saveRegisters(filteredRegisters);
      
      // Actualizar contador de registros del dispositivo
      this.updateDeviceRegisterCount(register.deviceId);
      
      return true;
    } catch (error) {
      console.error('Error deleting register:', error);
      return false;
    }
  }

  /**
   * Elimina todos los registros de un dispositivo
   * @param {number} deviceId - ID del dispositivo
   */
  deleteRegistersByDevice(deviceId) {
    try {
      const registers = this.getRegisters();
      const filteredRegisters = registers.filter(r => r.deviceId !== parseInt(deviceId));
      this.saveRegisters(filteredRegisters);
    } catch (error) {
      console.error('Error deleting registers by device:', error);
    }
  }

  /**
   * Actualiza el contador de registros activos de un dispositivo
   * @param {number} deviceId - ID del dispositivo
   */
  updateDeviceRegisterCount(deviceId) {
    try {
      const registers = this.getRegistersByDevice(deviceId);
      this.updateDevice(parseInt(deviceId), { 
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
