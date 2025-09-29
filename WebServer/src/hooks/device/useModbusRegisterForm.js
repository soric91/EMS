import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { useGlobalDevice } from "../../context/GlobalDevice";

export default function useModbusRegisterForm(deviceId, onClose, editRegister = null) {
  const { updateDeviceModbusRegisters } = useGlobalDevice();
  
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
      setValue('modbusId', 1);
      setValue('startAddress', 0);
      setValue('registers', 10);
    }
  }, [editRegister, setValue]);

  const onSubmit = async (data) => {
    console.log('Enviando datos:', data);
    console.log('Es edición?', !!editRegister);
    console.log('Registro original:', editRegister);
    
    const registerData = {
      id: editRegister?.id || uuidv4(),
      ...data
    };

    console.log('Datos finales a enviar:', registerData);

    const action = editRegister ? 'edit' : 'add';
    const result = await updateDeviceModbusRegisters(deviceId, registerData, action);
    console.log(`Registro ${editRegister ? 'actualizado' : 'creado'}:`, result);
    
    if (result && result.success) {
      if (onClose) onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    reset();
  };

  return {
    register,
    handleSubmit,
    reset,
    resetForm,
    onSubmit,
    formState,
    setValue
  };
}