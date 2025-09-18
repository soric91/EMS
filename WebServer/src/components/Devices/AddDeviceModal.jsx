import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Modal para añadir/editar dispositivos Modbus
 */
export default function AddDeviceModal({ isOpen, onClose, onSave, editDevice = null }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'CT Meter',
    protocol: 'TCP', // TCP o RTU
    ip: '',
    port: '502',
    serialPort: '',
    baudRate: '9600',
    parity: 'None',
    dataBits: '8',
    stopBits: '1',
    modbusId: '',
    startAddress: '0', // Dirección inicial de registros
    registers: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deviceTypes = ['CT Meter', 'Smart Meter', 'Solar Inverter', 'Energy Monitor'];

  // Cargar datos del dispositivo para edición
  useEffect(() => {
    if (editDevice) {
      console.log('Cargando datos para editar:', editDevice); // Debug
      setFormData({
        name: String(editDevice.name || ''),
        type: String(editDevice.type || 'CT Meter'),
        protocol: String(editDevice.protocol || 'TCP'),
        ip: String(editDevice.ip || ''),
        port: String(editDevice.port || '502'),
        serialPort: String(editDevice.serialPort || ''),
        baudRate: String(editDevice.baudRate || '9600'),
        parity: String(editDevice.parity || 'None'),
        dataBits: String(editDevice.dataBits || '8'),
        stopBits: String(editDevice.stopBits || '1'),
        modbusId: String(editDevice.modbusId || ''),
        startAddress: String(editDevice.startAddress || '0'),
        registers: String(editDevice.registers || ''),
        description: String(editDevice.description || '')
      });
      // Limpiar errores al cargar datos
      setErrors({});
    } else {
      // Reset form para nuevo dispositivo
      setFormData({
        name: '',
        type: 'CT Meter',
        protocol: 'TCP',
        ip: '',
        port: '502',
        serialPort: '',
        baudRate: '9600',
        parity: 'None',
        dataBits: '8',
        stopBits: '1',
        modbusId: '',
        startAddress: '0',
        registers: '',
        description: ''
      });
      setErrors({});
    }
    // Reset del estado de submit
    setIsSubmitting(false);
  }, [editDevice, isOpen]); // Agregamos isOpen como dependencia

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Debug para protocolo
    if (name === 'protocol') {
      console.log('Protocol changed from', formData.protocol, 'to', value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar TODOS los campos como obligatorios (convertir a string primero)
    if (!String(formData.name || '').trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!String(formData.type || '').trim()) {
      newErrors.type = 'El tipo de dispositivo es obligatorio';
    }

    if (!String(formData.protocol || '').trim()) {
      newErrors.protocol = 'El protocolo es obligatorio';
    }

    // Validaciones específicas según el protocolo
    if (formData.protocol === 'TCP') {
      if (!String(formData.ip || '').trim()) {
        newErrors.ip = 'La dirección IP es obligatoria';
      } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.ip)) {
        newErrors.ip = 'Formato de IP inválido';
      }

      if (!String(formData.port || '').trim()) {
        newErrors.port = 'El puerto es obligatorio';
      } else if (isNaN(formData.port) || formData.port < 1 || formData.port > 65535) {
        newErrors.port = 'Puerto debe ser un número entre 1 y 65535';
      }
    } else if (formData.protocol === 'RTU') {
      if (!String(formData.serialPort || '').trim()) {
        newErrors.serialPort = 'El puerto serial es obligatorio';
      }

      if (!String(formData.baudRate || '').trim()) {
        newErrors.baudRate = 'La velocidad de baudios es obligatoria';
      } else if (isNaN(formData.baudRate) || formData.baudRate <= 0) {
        newErrors.baudRate = 'Debe ser un número válido mayor a 0';
      }

      if (!String(formData.parity || '').trim()) {
        newErrors.parity = 'La paridad es obligatoria';
      }

      if (!String(formData.dataBits || '').trim()) {
        newErrors.dataBits = 'Los bits de datos son obligatorios';
      } else if (isNaN(formData.dataBits) || ![7, 8].includes(parseInt(formData.dataBits))) {
        newErrors.dataBits = 'Debe ser 7 u 8 bits';
      }

      if (!String(formData.stopBits || '').trim()) {
        newErrors.stopBits = 'Los bits de parada son obligatorios';
      } else if (isNaN(formData.stopBits) || ![1, 2].includes(parseInt(formData.stopBits))) {
        newErrors.stopBits = 'Debe ser 1 o 2 bits';
      }
    }

    if (!String(formData.modbusId || '').trim()) {
      newErrors.modbusId = 'El ID Modbus es obligatorio';
    } else if (isNaN(formData.modbusId) || formData.modbusId < 1 || formData.modbusId > 247) {
      newErrors.modbusId = 'ID Modbus debe ser un número entre 1 y 247';
    }

    if (!String(formData.startAddress || '').trim()) {
      newErrors.startAddress = 'La dirección inicial es obligatoria';
    } else if (isNaN(formData.startAddress) || formData.startAddress < 0) {
      newErrors.startAddress = 'Debe ser un número mayor o igual a 0';
    }

    if (!String(formData.registers || '').trim()) {
      newErrors.registers = 'El número de registros es obligatorio';
    } else if (isNaN(formData.registers) || formData.registers < 1) {
      newErrors.registers = 'Debe ser un número mayor a 0';
    }

    // Descripción también obligatoria
    if (!String(formData.description || '').trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevenir múltiples envíos
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const deviceData = {
          ...formData,
          // Incluir ID si estamos editando
          ...(editDevice && { id: editDevice.id }),
          port: formData.protocol === 'TCP' ? parseInt(formData.port) : undefined,
          baudRate: formData.protocol === 'RTU' ? parseInt(formData.baudRate) : undefined,
          dataBits: formData.protocol === 'RTU' ? parseInt(formData.dataBits) : undefined,
          stopBits: formData.protocol === 'RTU' ? parseInt(formData.stopBits) : undefined,
          modbusId: parseInt(formData.modbusId),
          startAddress: parseInt(formData.startAddress),
          registers: parseInt(formData.registers),
          // Mantener status y lastRead si estamos editando
          status: editDevice?.status || 'Disconnected',
          lastRead: editDevice?.lastRead || 'Never'
        };
        
        console.log('AddDeviceModal - Enviando datos:', deviceData);
        console.log('AddDeviceModal - editDevice:', editDevice);
        
        // Llamar a onSave y esperar el resultado
        const success = await onSave(deviceData);
        console.log('AddDeviceModal - Resultado de onSave:', success);
        
        // Solo cerrar si fue exitoso, pero no resetear si seguimos editando
        if (success !== false) {
          // Solo resetear si no hay editDevice (es un nuevo dispositivo)
          if (!editDevice) {
            setFormData({
              name: '',
              type: 'CT Meter',
              protocol: 'TCP',
              ip: '',
              port: '502',
              serialPort: '',
              baudRate: '9600',
              parity: 'None',
              dataBits: '8',
              stopBits: '1',
              modbusId: '',
              startAddress: '0',
              registers: '',
              description: ''
            });
          }
          setErrors({});
          onClose();
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'CT Meter',
      protocol: 'TCP',
      ip: '',
      port: '502',
      serialPort: '',
      baudRate: '9600',
      parity: 'None',
      dataBits: '8',
      stopBits: '1',
      modbusId: '',
      startAddress: '0',
      registers: '',
      description: ''
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-zinc-900 rounded-xl border border-zinc-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-700">
          <h2 className="text-xl font-semibold text-white">
            {editDevice ? 'Editar Dispositivo Modbus' : 'Añadir Dispositivo Modbus'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Información Básica</h3>
            
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Nombre del Dispositivo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ej: Medidor Principal"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Tipo de Dispositivo *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {deviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-400">{errors.type}</p>
              )}
            </div>

            {/* Protocolo */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Protocolo *
              </label>
              <select
                name="protocol"
                value={formData.protocol}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="TCP">Modbus TCP</option>
                <option value="RTU">Modbus RTU</option>
              </select>
              {errors.protocol && (
                <p className="mt-1 text-sm text-red-400">{errors.protocol}</p>
              )}
            </div>
          </div>

          {/* Configuración de Conexión */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Configuración de Conexión</h3>
            
            {/* Debug info - remover después */}
            <div className="text-xs text-yellow-400 p-2 bg-yellow-900/20 rounded">
              Debug: Protocol = "{formData.protocol}" | Type: {typeof formData.protocol}
            </div>
            
            {formData.protocol === 'TCP' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* IP */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Dirección IP *
                  </label>
                  <input
                    type="text"
                    name="ip"
                    value={formData.ip}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="192.168.1.100"
                  />
                  {errors.ip && (
                    <p className="mt-1 text-sm text-red-400">{errors.ip}</p>
                  )}
                </div>

                {/* Puerto */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Puerto *
                  </label>
                  <input
                    type="number"
                    name="port"
                    value={formData.port}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="502"
                  />
                  {errors.port && (
                    <p className="mt-1 text-sm text-red-400">{errors.port}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Puerto Serial */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Puerto Serial *
                  </label>
                  <input
                    type="text"
                    name="serialPort"
                    value={formData.serialPort}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="/dev/ttyUSB0 o COM1"
                  />
                  {errors.serialPort && (
                    <p className="mt-1 text-sm text-red-400">{errors.serialPort}</p>
                  )}
                </div>

                {/* Baud Rate */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Velocidad (bps) *
                  </label>
                  <select
                    name="baudRate"
                    value={formData.baudRate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="9600">9600</option>
                    <option value="19200">19200</option>
                    <option value="38400">38400</option>
                    <option value="57600">57600</option>
                    <option value="115200">115200</option>
                  </select>
                  {errors.baudRate && (
                    <p className="mt-1 text-sm text-red-400">{errors.baudRate}</p>
                  )}
                </div>

                {/* Paridad */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Paridad *
                  </label>
                  <select
                    name="parity"
                    value={formData.parity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="None">Sin paridad</option>
                    <option value="Even">Par</option>
                    <option value="Odd">Impar</option>
                  </select>
                  {errors.parity && (
                    <p className="mt-1 text-sm text-red-400">{errors.parity}</p>
                  )}
                </div>

                {/* Data Bits */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Bits de Datos *
                  </label>
                  <select
                    name="dataBits"
                    value={formData.dataBits}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="7">7 bits</option>
                    <option value="8">8 bits</option>
                  </select>
                  {errors.dataBits && (
                    <p className="mt-1 text-sm text-red-400">{errors.dataBits}</p>
                  )}
                </div>

                {/* Stop Bits */}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Bits de Parada *
                  </label>
                  <select
                    name="stopBits"
                    value={formData.stopBits}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="1">1 bit</option>
                    <option value="2">2 bits</option>
                  </select>
                  {errors.stopBits && (
                    <p className="mt-1 text-sm text-red-400">{errors.stopBits}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Configuración Modbus */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Configuración Modbus</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ID Modbus */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  ID Modbus *
                </label>
                <input
                  type="number"
                  name="modbusId"
                  value={formData.modbusId}
                  onChange={handleInputChange}
                  min="1"
                  max="247"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="1"
                />
                {errors.modbusId && (
                  <p className="mt-1 text-sm text-red-400">{errors.modbusId}</p>
                )}
              </div>

              {/* Dirección Inicial */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Dirección Inicial *
                </label>
                <input
                  type="number"
                  name="startAddress"
                  value={formData.startAddress}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0"
                />
                {errors.startAddress && (
                  <p className="mt-1 text-sm text-red-400">{errors.startAddress}</p>
                )}
              </div>

              {/* Número de Registros */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Número de Registros *
                </label>
                <input
                  type="number"
                  name="registers"
                  value={formData.registers}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="10"
                />
                {errors.registers && (
                  <p className="mt-1 text-sm text-red-400">{errors.registers}</p>
                )}
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Descripción del dispositivo..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                isSubmitting 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {isSubmitting 
                ? 'Guardando...' 
                : (editDevice ? 'Actualizar Dispositivo' : 'Guardar Dispositivo')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
