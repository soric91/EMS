import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalDevice } from '../../context/GlobalDevice.jsx';

const useEditDevice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    getDeviceById, 
    getRegistersByDevice, 
    updateDevice, 
    deleteRegister, 
    addRegister, 
    updateRegister 
  } = useGlobalDevice();
  
  // Estados del hook
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [editingRegister, setEditingRegister] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showEditDeviceModal, setShowEditDeviceModal] = useState(false);
  
  // Datos del dispositivo y registros
  const device = getDeviceById(id);
  const registers = getRegistersByDevice(id);

  // Función para verificar si el dispositivo existe
  const isDeviceValid = () => {
    return device && Object.keys(device).length > 0;
  };

  // Navegación de vuelta
  const handleNavigateBack = () => {
    navigate('/devices');
  };

  // Manejo del modal de edición de dispositivo
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

  // Manejo de registros
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

  // Retornar todos los datos y funciones que necesita el componente
  return {
    // Datos
    device,
    registers,
    deviceId: id,
    
    // Estados
    showRegisterForm,
    editingRegister,
    isConnecting,
    showEditDeviceModal,
    
    // Funciones de validación
    isDeviceValid,
    
    // Funciones de navegación
    handleNavigateBack,
    
    // Funciones de dispositivo
    handleEditDevice,
    handleSaveDevice,
    handleCancelEditDevice,
    
    // Funciones de registros
    handleAddRegister,
    handleEditRegister,
    handleDeleteRegister,
    handleSaveRegister,
    handleCancelRegister,
    
    // Funciones de estado (por si necesitas cambiar estados manualmente)
    setIsConnecting,
    setShowRegisterForm,
    setEditingRegister,
    setShowEditDeviceModal
  };
};

export default useEditDevice;