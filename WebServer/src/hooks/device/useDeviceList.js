import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalDevice } from '../../context/GlobalDevice';

/**
 * Hook especializado para la gestión de lista de dispositivos
 * Centraliza toda la lógica relacionada con la vista de lista
 */
export const useDeviceList = () => {
  const navigate = useNavigate();
  const { devices, deleteDevice, updateDevice, syncDevices } = useGlobalDevice();
  
  // Estados locales para la lista
  const [selectedDevices, setSelectedDevices] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'deviceName', direction: 'asc' });
  const [filterConfig, setFilterConfig] = useState({
    status: 'all', // 'all' | 'connected' | 'disconnected'
    protocol: 'all', // 'all' | 'TCP' | 'RTU'
    search: ''
  });

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const total = devices?.length || 0;
    const connected = devices?.filter(d => d.status === "Connected").length || 0;
    const disconnected = total - connected;
    const connectionRate = total > 0 ? Math.round((connected / total) * 100) : 0;

    return {
      total,
      connected,
      disconnected,
      connectionRate,
      protocols: {
        tcp: devices?.filter(d => d.protocol === 'TCP').length || 0,
        rtu: devices?.filter(d => d.protocol === 'RTU').length || 0
      }
    };
  }, [devices]);

  // Dispositivos filtrados y ordenados
  const filteredAndSortedDevices = useMemo(() => {
    let filtered = devices || [];

    // Filtrar por estado
    if (filterConfig.status !== 'all') {
      const statusFilter = filterConfig.status === 'connected' ? 'Connected' : 'Disconnected';
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    // Filtrar por protocolo
    if (filterConfig.protocol !== 'all') {
      filtered = filtered.filter(d => d.protocol === filterConfig.protocol);
    }

    // Filtrar por búsqueda
    if (filterConfig.search) {
      const searchLower = filterConfig.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.deviceName?.toLowerCase().includes(searchLower) ||
        d.deviceType?.toLowerCase().includes(searchLower) ||
        d.description?.toLowerCase().includes(searchLower) ||
        d.ipAddress?.includes(searchLower)
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      const { key, direction } = sortConfig;
      let aValue = a[key];
      let bValue = b[key];

      // Manejar casos especiales
      if (key === 'status') {
        aValue = a.status === 'Connected' ? 1 : 0;
        bValue = b.status === 'Connected' ? 1 : 0;
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [devices, filterConfig, sortConfig]);

  // Funciones de navegación
  const navigateToDevice = (deviceId) => {
    navigate(`/devices/${deviceId}`);
  };

  const navigateToNewDevice = () => {
    navigate('/devices/new');
  };

  const navigateToEditDevice = (deviceId) => {
    navigate(`/devices/${deviceId}/edit`);
  };

  // Funciones de selección
  const toggleDeviceSelection = (deviceId) => {
    setSelectedDevices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deviceId)) {
        newSet.delete(deviceId);
      } else {
        newSet.add(deviceId);
      }
      return newSet;
    });
  };

  const selectAllDevices = () => {
    setSelectedDevices(new Set(filteredAndSortedDevices.map(d => d.id)));
  };

  const deselectAllDevices = () => {
    setSelectedDevices(new Set());
  };

  const toggleSelectAll = () => {
    if (selectedDevices.size === filteredAndSortedDevices.length) {
      deselectAllDevices();
    } else {
      selectAllDevices();
    }
  };

  // Funciones de ordenamiento
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Funciones de filtrado
  const handleFilterChange = (type, value) => {
    setFilterConfig(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const clearFilters = () => {
    setFilterConfig({
      status: 'all',
      protocol: 'all',
      search: ''
    });
  };

  // Acciones en lote
  const handleBulkDelete = async () => {
    if (selectedDevices.size === 0) return;
    
    const confirmMessage = `¿Estás seguro de que quieres eliminar ${selectedDevices.size} dispositivo(s)?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      const deletePromises = Array.from(selectedDevices).map(deviceId => 
        deleteDevice(deviceId)
      );
      await Promise.all(deletePromises);
      setSelectedDevices(new Set());
    } catch (error) {
      console.error('Error en eliminación en lote:', error);
      alert('Error al eliminar algunos dispositivos');
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedDevices.size === 0) return;

    try {
      const updatePromises = Array.from(selectedDevices).map(deviceId => {
        const device = devices.find(d => d.id === deviceId);
        return updateDevice(deviceId, { ...device, status: newStatus });
      });
      await Promise.all(updatePromises);
      setSelectedDevices(new Set());
    } catch (error) {
      console.error('Error en cambio de estado en lote:', error);
      alert('Error al cambiar el estado de algunos dispositivos');
    }
  };

  // Función de sincronización
  const handleSync = async () => {
    try {
      await syncDevices?.();
      console.log('Dispositivos sincronizados');
    } catch (error) {
      console.error('Error en sincronización:', error);
      alert('Error al sincronizar dispositivos');
    }
  };

  // Estado de selección
  const selectionState = {
    selectedCount: selectedDevices.size,
    totalCount: filteredAndSortedDevices.length,
    isAllSelected: selectedDevices.size === filteredAndSortedDevices.length && filteredAndSortedDevices.length > 0,
    isPartiallySelected: selectedDevices.size > 0 && selectedDevices.size < filteredAndSortedDevices.length,
    hasSelection: selectedDevices.size > 0
  };

  return {
    // Datos
    devices: filteredAndSortedDevices,
    stats,
    
    // Estados
    selectedDevices,
    sortConfig,
    filterConfig,
    selectionState,
    
    // Navegación
    navigateToDevice,
    navigateToNewDevice,
    navigateToEditDevice,
    
    // Selección
    toggleDeviceSelection,
    selectAllDevices,
    deselectAllDevices,
    toggleSelectAll,
    
    // Filtrado y ordenamiento
    handleSort,
    handleFilterChange,
    clearFilters,
    
    // Acciones en lote
    handleBulkDelete,
    handleBulkStatusChange,
    
    // Otras acciones
    handleSync,
    
    // Utilidades
    isDeviceSelected: (deviceId) => selectedDevices.has(deviceId),
    getFilterDescription: () => {
      const parts = [];
      if (filterConfig.status !== 'all') parts.push(`Estado: ${filterConfig.status}`);
      if (filterConfig.protocol !== 'all') parts.push(`Protocolo: ${filterConfig.protocol}`);
      if (filterConfig.search) parts.push(`Búsqueda: "${filterConfig.search}"`);
      return parts.length > 0 ? parts.join(', ') : 'Sin filtros';
    }
  };
};