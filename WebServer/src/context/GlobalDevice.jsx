import { createContext, useContext, useReducer, useEffect } from "react";
import  EMSDataManager  from "../utils/EMSDataManager";
import { addConfigParamsModbus } from "../api/apiModbus";
import  {AppReducer}  from "./AppReducer";


// Estado inicial
const initialState = {
  devices: [],
  registers: [],
  loading: false,
  error: null,
  selectedDevice: null
};

// Tipos de acciones


const Context = createContext();

export const useGlobalDevice = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useGlobalDevice must be used within a GlobalDeviceProvider');
  }
  return context;
};

// Provider Component
export const GlobalDeviceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer,  initialState);
  const dataManager = new EMSDataManager();

  // Cargar datos iniciales
  useEffect(() => {
    loadDevices();
    loadRegisters();
  }, []);

  // ==========================================
  // FUNCIONES DE CARGA DE DATOS
  // ==========================================

  const loadDevices = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const devices = dataManager.getDevices();
      dispatch({ type: "SET_DEVICES", payload: devices });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: 'Error loading devices' });
      console.error('Error loading devices:', error);
    }
  };

  const loadRegisters = async () => {
    try {
      const registers = dataManager.getRegisters();
      dispatch({ type: "SET_REGISTERS", payload: registers });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: 'Error loading registers' });
      console.error('Error loading registers:', error);
    }
  };

  // ==========================================
  // FUNCIONES DE DISPOSITIVOS
  // ==========================================

  const addDevice = async (deviceData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const newDevice = dataManager.addDevice(deviceData);
      dispatch({ type: "ADD_DEVICE", payload: newDevice });

      return { success: true, device: newDevice };
    } catch (error) {
      const errorMessage = 'Error adding device';
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      console.error('Error adding device:', error);
      return { success: false, error: errorMessage };
    }
  };

  const updateDevice = async (deviceId, deviceData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const updatedDevice = dataManager.updateDevice(deviceId, deviceData);
      if (updatedDevice) {
        dispatch({ type: "UPDATE_DEVICE", payload: updatedDevice });
        return { success: true, device: updatedDevice };
      } else {
        throw new Error('Device not found');
      }
    } catch (error) {
      const errorMessage = 'Error updating device';
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      console.error('Error updating device:', error);
      return { success: false, error: errorMessage };
    }
  };

  const deleteDevice = async (deviceId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const success = dataManager.deleteDevice(deviceId);
      if (success) {
        // También eliminar todos los registros del dispositivo
        dataManager.deleteRegistersByDevice(deviceId);
        dispatch({ type: "DELETE_DEVICE", payload: deviceId });
        // Recargar registros para reflejar las eliminaciones
        loadRegisters();
        return { success: true };
      } else {
        throw new Error('Device not found');
      }
    } catch (error) {
      const errorMessage = 'Error deleting device';
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      console.error('Error deleting device:', error);
      return { success: false, error: errorMessage };
    }
  };

  const getDeviceById = (deviceId) => {
    return state.devices.find(device => device.id === deviceId) || {};
  };

  const setSelectedDevice = (device) => {
    dispatch({ type: "SET_SELECTED_DEVICE", payload: device });
  };

  // ==========================================
  // FUNCIONES DE REGISTROS
  // ==========================================

  const addRegister = async (registerData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const newRegister = dataManager.addRegister(registerData);
      dispatch({ type: "ADD_REGISTER", payload: newRegister });

      return { success: true, register: newRegister };
    } catch (error) {
      const errorMessage = 'Error adding register';
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      console.error('Error adding register:', error);
      return { success: false, error: errorMessage };
    }
  };

  const updateRegister = async (registerId, registerData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const updatedRegister = dataManager.updateRegister(registerId, registerData);
      if (updatedRegister) {
        dispatch({ type: "UPDATE_REGISTER", payload: updatedRegister });
        return { success: true, register: updatedRegister };
      } else {
        throw new Error('Register not found');
      }
    } catch (error) {
      const errorMessage = 'Error updating register';
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      console.error('Error updating register:', error);
      return { success: false, error: errorMessage };
    }
  };

  const deleteRegister = async (registerId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });
      
      const success = dataManager.deleteRegister(registerId);
      if (success) {
        dispatch({ type: "DELETE_REGISTER", payload: registerId });
        return { success: true };
      } else {
        throw new Error('Register not found');
      }
    } catch (error) {
      const errorMessage = 'Error deleting register';
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      console.error('Error deleting register:', error);
      return { success: false, error: errorMessage };
    }
  };

  const getRegistersByDevice = (deviceId) => {
    return state.registers.filter(register => register.deviceId === deviceId);
  };

  const getRegisterById = (registerId) => {
    return state.registers.find(register => register.id === registerId);
  };

  // ==========================================
  // FUNCIONES DE API
  // ==========================================

  const sendDeviceConfigToAPI = async (deviceId, token) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const device = getDeviceById(deviceId);
      if (!device) {
        throw new Error('Device not found');
      }

      const deviceRegisters = getRegistersByDevice(deviceId);
      
      // Preparar datos para la API
      const apiPayload = {
        device: {
          id: device.id,
          name: device.name,
          description: device.description,
          protocol: device.protocol,
          modbusId: device.modbusId,
          ...(device.protocol === 'TCP' && {
            ipAddress: device.ipAddress,
            port: device.port
          }),
          ...(device.protocol === 'RTU' && {
            serialPort: device.serialPort,
            baudRate: device.baudRate,
            parity: device.parity,
            dataBits: device.dataBits,
            stopBits: device.stopBits
          })
        },
        registers: deviceRegisters.map(register => ({
          id: register.id,
          name: register.name,
          description: register.description,
          address: register.address,
          type: register.type,
          dataType: register.dataType,
          scale: register.scale,
          unit: register.unit,
          deviceId: register.deviceId
        }))
      };

      const response = await addConfigParamsModbus(apiPayload, token);

      dispatch({ type: "SET_LOADING", payload: false });
      return { success: true, response };
      
    } catch (error) {
      const errorMessage = 'Error sending device config to API';
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      console.error('Error sending device config to API:', error);
      return { success: false, error: errorMessage };
    }
  };

  const sendAllDevicesConfigToAPI = async (token) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const results = [];
      
      for (const device of state.devices) {
        const result = await sendDeviceConfigToAPI(device.id, token);
        results.push({
          deviceId: device.id,
          deviceName: device.name,
          ...result
        });
        
        // Pequeña pausa entre requests para no saturar la API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      dispatch({ type: "SET_LOADING", payload: false });

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;
      
      return {
        success: errorCount === 0,
        results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: errorCount
        }
      };
      
    } catch (error) {
      const errorMessage = 'Error sending all devices config to API';
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      console.error('Error sending all devices config to API:', error);
      return { success: false, error: errorMessage };
    }
  };

  // ==========================================
  // FUNCIONES DE UTILIDAD
  // ==========================================

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const refreshData = async () => {
    await loadDevices();
    await loadRegisters();
  };

  // ==========================================
  // VALOR DEL CONTEXTO
  // ==========================================

  const contextValue = {
    // Estado
    ...state,
    
    // Funciones de dispositivos
    addDevice,
    updateDevice,
    deleteDevice,
    getDeviceById,
    setSelectedDevice,
    
    // Funciones de registros
    addRegister,
    updateRegister,
    deleteRegister,
    getRegistersByDevice,
    getRegisterById,
    
    // Funciones de API
    sendDeviceConfigToAPI,
    sendAllDevicesConfigToAPI,
    
    // Funciones de utilidad
    clearError,
    refreshData,
    loadDevices,
    loadRegisters
  };

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
};