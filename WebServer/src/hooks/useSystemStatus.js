import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar el estado del sistema
 * Puede expandirse para hacer requests reales a la API
 */
export const useSystemStatus = () => {
  const [status, setStatus] = useState({
    isOnline: true,
    label: 'Online',
    color: 'green',
    lastUpdate: new Date()
  });

  // Simulación de monitoreo del sistema
  useEffect(() => {
    // Aquí podrías hacer un polling a la API para obtener el estado real
    const checkSystemStatus = async () => {
      try {
        // Ejemplo: const response = await fetch('/api/health');
        // const data = await response.json();
        
        // Por ahora, mantener online
        setStatus(prev => ({
          ...prev,
          lastUpdate: new Date()
        }));
      } catch (error) {
        // Si hay error, marcar como offline
        setStatus({
          isOnline: false,
          label: 'Offline',
          color: 'red',
          lastUpdate: new Date()
        });
      }
    };

    // Check inicial
    checkSystemStatus();

    // Polling cada 30 segundos (opcional)
    const interval = setInterval(checkSystemStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...status,
    // Métodos útiles
    getStatusColor: () => {
      switch (status.color) {
        case 'green': return 'text-green-400';
        case 'yellow': return 'text-yellow-400';
        case 'red': return 'text-red-400';
        default: return 'text-zinc-400';
      }
    },
    getDotColor: () => {
      switch (status.color) {
        case 'green': return 'bg-green-400';
        case 'yellow': return 'bg-yellow-400';
        case 'red': return 'bg-red-400';
        default: return 'bg-zinc-400';
      }
    }
  };
};