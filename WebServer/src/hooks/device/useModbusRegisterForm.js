import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { useGlobalDevice } from "../../context/GlobalDevice";

export default function useModbusRegisterForm(deviceId, device, onClose, editRegister = null) {
  const { updateDeviceModbusRegisters, getDeviceById } = useGlobalDevice();
  
  // Obtener información del dispositivo si no se pasa
  const currentDevice = device || getDeviceById(deviceId);
  
  const { register, handleSubmit, reset, formState, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      modbusId: editRegister?.modbusId || 1,
      startAddress: editRegister?.startAddress || 0,
      registers: editRegister?.registers || 10
    }
  });

  // Actualizar valores del formulario cuando cambie editRegister
  useEffect(() => {
    if (editRegister) {
      setValue('modbusId', editRegister.modbusId);
      setValue('startAddress', editRegister.startAddress);
      setValue('registers', editRegister.registers);
    } else {
      // Valores por defecto según el tipo de dispositivo
      const defaultValues = getDeviceSpecificDefaults(currentDevice);
      setValue('modbusId', defaultValues.modbusId);
      setValue('startAddress', defaultValues.startAddress);
      setValue('registers', defaultValues.registers);
    }
  }, [editRegister, setValue, currentDevice]);

  // Función para obtener valores por defecto específicos del dispositivo
  const getDeviceSpecificDefaults = (device) => {
    if (!device) return { modbusId: 1, startAddress: 0, registers: 10 };
    
    // Configuraciones específicas según el tipo de dispositivo
    const deviceTypeDefaults = {
      'inverter': { modbusId: 1, startAddress: 40001, registers: 20 },
      'battery': { modbusId: 2, startAddress: 30001, registers: 15 },
      'meter': { modbusId: 3, startAddress: 30000, registers: 10 },
      'sensor': { modbusId: 4, startAddress: 40000, registers: 5 },
      'other': { modbusId: 1, startAddress: 0, registers: 10 }
    };
    
    return deviceTypeDefaults[device.deviceType] || deviceTypeDefaults['other'];
  };

  const onSubmit = async (data) => {
    console.log(`Guardando registro Modbus para dispositivo: ${currentDevice?.deviceName}`);
    console.log('Enviando datos:', data);
    console.log('Es edición?', !!editRegister);
    
    const registerData = {
      id: editRegister?.id || uuidv4(),
      ...data,
      // Metadata específica del dispositivo
      deviceId: deviceId,
      deviceName: currentDevice?.deviceName,
      deviceType: currentDevice?.deviceType,
      protocol: currentDevice?.protocol,
      createdAt: editRegister?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Información de conexión específica
      connectionInfo: currentDevice?.protocol === 'TCP' 
        ? `${currentDevice.ipAddress}:${currentDevice.port}`
        : currentDevice?.serialPort || 'Unknown'
    };

    console.log('Datos finales con metadata del dispositivo:', registerData);

    const action = editRegister ? 'edit' : 'add';
    const result = await updateDeviceModbusRegisters(deviceId, registerData, action);
    
    if (result && result.success !== false) {
      console.log(`Registro ${editRegister ? 'actualizado' : 'creado'} para ${currentDevice?.deviceName}:`, result);
      if (onClose) onClose();
      resetForm();
    } else {
      console.error('Error al guardar el registro:', result);
    }
  };

  const resetForm = () => {
    reset();
  };

  // Función de validación específica del dispositivo
  const validateRegisterForDevice = (data) => {
    if (!currentDevice) return { valid: false, errors: ['Dispositivo no encontrado'] };
    
    const errors = [];
    
    // Validaciones específicas según el protocolo
    if (currentDevice.protocol === 'TCP') {
      if (data.startAddress < 0 || data.startAddress > 65535) {
        errors.push('Dirección inicial debe estar entre 0 y 65535 para Modbus TCP');
      }
    } else if (currentDevice.protocol === 'RTU') {
      if (data.modbusId < 1 || data.modbusId > 247) {
        errors.push('ID Modbus debe estar entre 1 y 247 para Modbus RTU');
      }
    }
    
    // Validaciones específicas según el tipo de dispositivo
    if (currentDevice.deviceType === 'inverter' && data.registers > 50) {
      errors.push('Inversores típicamente no requieren más de 50 registros');
    }
    
    return { valid: errors.length === 0, errors };
  };

  return {
    register,
    handleSubmit,
    reset,
    resetForm,
    onSubmit,
    formState,
    setValue,
    currentDevice,
    validateRegisterForDevice,
    getDeviceSpecificDefaults
  };
}