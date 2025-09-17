// src/hooks/useDeviceConfig.js
import { useState, useEffect } from 'react';
import { emsDataManager } from '../utils/EMSDataManager.js';

export function useDeviceConfig(deviceId) {
  const [device, setDevice] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!deviceId) return;
    
    const deviceData = emsDataManager.getDeviceById(deviceId);
    if (deviceData) {
      setDevice(deviceData);
      setConnectionStatus(deviceData.status || 'Disconnected');
    }
  }, [deviceId]);

  const updateDevice = (updatedDevice) => {
    const updated = emsDataManager.updateDevice(deviceId, updatedDevice);
    if (updated) {
      setDevice({ ...updated });
      return true;
    }
    return false;
  };

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
          const updatedDevice = {
            ...device,
            status: 'Connected',
            lastConnected: new Date().toISOString()
          };
          updateDevice(updatedDevice);
        }
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'No se pudo establecer conexión con el dispositivo. Verifique la dirección IP y que el dispositivo esté accesible.' 
        };
      }
    } catch (error) {
      console.error('Error connecting:', error);
      return { 
        success: false, 
        error: 'Error durante el proceso de conexión: ' + error.message 
      };
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setConnectionStatus('Disconnected');
    if (device) {
      const updatedDevice = {
        ...device,
        status: 'Disconnected',
        lastDisconnected: new Date().toISOString()
      };
      updateDevice(updatedDevice);
    }
  };

  const isConnected = connectionStatus === 'Connected';

  return {
    device,
    connectionStatus,
    isConnecting,
    isConnected,
    updateDevice,
    handleConnect,
    handleDisconnect
  };
}
