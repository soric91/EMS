// src/utils/registerValidation.js

export function validateRegisterData(registerData, currentEditRegister = null, registers = [], device = null) {
  const errors = [];

  // Validar TODOS los campos como obligatorios
  if (!registerData.name || registerData.name.trim() === '') {
    errors.push('El nombre del registro es obligatorio');
  }

  if (!registerData.address || isNaN(registerData.address) || registerData.address < 0) {
    errors.push('La dirección debe ser un número mayor o igual a 0');
  }

  if (!registerData.type || registerData.type.trim() === '') {
    errors.push('El tipo de registro es obligatorio');
  }

  if (!registerData.dataType || registerData.dataType.trim() === '') {
    errors.push('El tipo de datos es obligatorio');
  }

  if (!registerData.scale || isNaN(registerData.scale)) {
    errors.push('La escala debe ser un número válido');
  }

  if (!registerData.unit || registerData.unit.trim() === '') {
    errors.push('La unidad de medida es obligatoria');
  }

  // Validar que no exista otro registro con el mismo nombre o dirección en este dispositivo
  // (excluyendo el registro actual en edición)
  const existingRegisters = registers || [];
  const nameExists = existingRegisters.some(register => 
    register.name.toLowerCase() === registerData.name.toLowerCase() &&
    (!currentEditRegister || register.id !== currentEditRegister.id)
  );
  const addressExists = existingRegisters.some(register => 
    register.address === parseInt(registerData.address) &&
    (!currentEditRegister || register.id !== currentEditRegister.id)
  );

  if (nameExists) {
    errors.push('Ya existe un registro con ese nombre en este dispositivo');
  }

  if (addressExists) {
    errors.push('Ya existe un registro con esa dirección en este dispositivo');
  }

  // Validar que la dirección esté dentro del rango permitido del dispositivo
  if (device && device.startAddress !== undefined && device.registers !== undefined) {
    const deviceStartAddress = parseInt(device.startAddress);
    const deviceEndAddress = deviceStartAddress + parseInt(device.registers) - 1;
    const registerAddress = parseInt(registerData.address);

    if (registerAddress < deviceStartAddress || registerAddress > deviceEndAddress) {
      errors.push(`La dirección debe estar entre ${deviceStartAddress} y ${deviceEndAddress} (rango del dispositivo)`);
    }
  }

  return errors;
}
