// src/hooks/useDeviceRegisters.js
import { useState, useEffect } from 'react';
import { emsDataManager } from '../utils/EMSDataManager.js';
import { validateRegisterData } from '../utils/registerValidation.js';

export function useDeviceRegisters(deviceId, device) {
  const [registers, setRegisters] = useState([]);
  const [editRegister, setEditRegister] = useState(null);

  useEffect(() => {
    if (!deviceId) return;
    
    const deviceRegisters = emsDataManager.getRegistersByDevice(deviceId);
    setRegisters(deviceRegisters);
  }, [deviceId]);

  const handleAddRegister = async (registerData) => {
    try {
      // Validar datos antes de guardar
      const validationErrors = validateRegisterData(registerData, editRegister, registers, device);
      
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors
        };
      }

      if (editRegister) {
        // Estamos editando un registro existente
        
        const updatedRegister = emsDataManager.updateRegister(editRegister.id, registerData);
       
        
        if (updatedRegister) {
          
          setRegisters(prev => prev.map(reg => 
            reg.id === editRegister.id ? updatedRegister : reg
          ));
          return { success: true };
        } else {
          console.error('Error: updateRegister retornó null');
          return {
            success: false,
            errors: ['No se pudo actualizar el registro. Verifique los datos e intente nuevamente.']
          };
        }
      } else {
        // Estamos agregando un nuevo registro
        console.log('Agregando nuevo registro:', registerData);
        const newRegister = emsDataManager.addRegister(deviceId, registerData);
        
        if (newRegister) {
          setRegisters(prev => [...prev, newRegister]);
          return { success: true };
        } else {
          return {
            success: false,
            errors: ['No se pudo agregar el registro. Verifique los datos e intente nuevamente.']
          };
        }
      }
    } catch (error) {
      console.error('Error al procesar registro:', error);
      return {
        success: false,
        errors: ['Error inesperado al procesar el registro: ' + error.message]
      };
    }
  };

  const handleEditRegister = (register) => {
    console.log('Abriendo modal para editar registro:', register);
    setEditRegister(register);
  };

  const handleDeleteRegister = (registerId) => {
    const deleted = emsDataManager.deleteRegister(registerId);
    if (deleted) {
      setRegisters(prev => prev.filter(reg => reg.id !== registerId));
      return true;
    }
    return false;
  };

  const clearEditRegister = () => {
    setEditRegister(null);
  };

  return {
    registers,
    editRegister,
    handleAddRegister,
    handleEditRegister,
    handleDeleteRegister,
    clearEditRegister
  };
}
