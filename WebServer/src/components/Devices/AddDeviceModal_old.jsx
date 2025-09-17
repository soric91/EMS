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
      setFormData({
        name: editDevice.name || '',
        type: editDevice.type || 'CT Meter',
        protocol: editDevice.protocol || 'TCP',
        ip: editDevice.ip || '',
        port: editDevice.port?.toString() || '502',
        serialPort: editDevice.serialPort || '',
        baudRate: editDevice.baudRate || '9600',
        parity: editDevice.parity || 'None',
        dataBits: editDevice.dataBits || '8',
        stopBits: editDevice.stopBits || '1',
        modbusId: editDevice.modbusId?.toString() || '',
        startAddress: editDevice.startAddress?.toString() || '0',
        registers: editDevice.registers?.toString() || '',
        description: editDevice.description || ''
      });
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
    }
    setErrors({});
  }, [editDevice, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar TODOS los campos como obligatorios
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.type.trim()) {
      newErrors.type = 'El tipo de dispositivo es obligatorio';
    }

    if (!formData.protocol.trim()) {
      newErrors.protocol = 'El protocolo es obligatorio';
    }

    // Validaciones específicas según el protocolo
    if (formData.protocol === 'TCP') {
      if (!formData.ip.trim()) {
        newErrors.ip = 'La dirección IP es obligatoria';
      } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.ip)) {
        newErrors.ip = 'Formato de IP inválido';
      }

      if (!formData.port.trim()) {
        newErrors.port = 'El puerto es obligatorio';
      } else if (isNaN(formData.port) || formData.port < 1 || formData.port > 65535) {
        newErrors.port = 'Puerto debe ser un número entre 1 y 65535';
      }
    } else if (formData.protocol === 'RTU') {
      if (!formData.serialPort.trim()) {
        newErrors.serialPort = 'El puerto serial es obligatorio';
      }

      if (!formData.baudRate.trim()) {
        newErrors.baudRate = 'La velocidad de baudios es obligatoria';
      } else if (isNaN(formData.baudRate) || formData.baudRate <= 0) {
        newErrors.baudRate = 'Debe ser un número válido mayor a 0';
      }

      if (!formData.parity.trim()) {
        newErrors.parity = 'La paridad es obligatoria';
      }

      if (!formData.dataBits.trim()) {
        newErrors.dataBits = 'Los bits de datos son obligatorios';
      } else if (isNaN(formData.dataBits) || ![7, 8].includes(parseInt(formData.dataBits))) {
        newErrors.dataBits = 'Debe ser 7 u 8 bits';
      }

      if (!formData.stopBits.trim()) {
        newErrors.stopBits = 'Los bits de parada son obligatorios';
      } else if (isNaN(formData.stopBits) || ![1, 2].includes(parseInt(formData.stopBits))) {
        newErrors.stopBits = 'Debe ser 1 o 2 bits';
      }
    }

    if (!formData.modbusId.trim()) {
      newErrors.modbusId = 'El ID Modbus es obligatorio';
    } else if (isNaN(formData.modbusId) || formData.modbusId < 1 || formData.modbusId > 247) {
      newErrors.modbusId = 'ID Modbus debe ser un número entre 1 y 247';
    }

    if (!formData.startAddress.trim()) {
      newErrors.startAddress = 'La dirección inicial es obligatoria';
    } else if (isNaN(formData.startAddress) || formData.startAddress < 0) {
      newErrors.startAddress = 'Debe ser un número mayor o igual a 0';
    }

    if (!formData.registers.trim()) {
      newErrors.registers = 'El número de registros es obligatorio';
    } else if (isNaN(formData.registers) || formData.registers < 1) {
      newErrors.registers = 'Debe ser un número mayor a 0';
    }

    // Descripción también obligatoria
    if (!formData.description.trim()) {
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
          port: formData.protocol === 'TCP' ? parseInt(formData.port) : undefined,
          baudRate: formData.protocol === 'RTU' ? parseInt(formData.baudRate) : undefined,
          dataBits: formData.protocol === 'RTU' ? parseInt(formData.dataBits) : undefined,
          stopBits: formData.protocol === 'RTU' ? parseInt(formData.stopBits) : undefined,
          modbusId: parseInt(formData.modbusId),
          startAddress: parseInt(formData.startAddress),
          registers: parseInt(formData.registers),
          status: 'Disconnected',
          lastRead: 'Never'
        };
        
        // Llamar a onSave y esperar el resultado
        const success = await onSave(deviceData);
        
        // Solo resetear y cerrar si fue exitoso
        if (success !== false) {
          // Reset form
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="Ej: CT Meter 01"
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Tipo de Dispositivo
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
              </div>
            </div>
          </div>

          {/* Configuración Modbus */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Configuración Modbus</h3>
            
            {/* Selección de Protocolo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="TCP">TCP</option>
                  <option value="RTU">RTU</option>
                </select>
                {errors.protocol && <p className="mt-1 text-sm text-red-400">{errors.protocol}</p>}
              </div>
            </div>

            {/* Campos específicos del protocolo */}
            {formData.protocol === 'TCP' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {errors.ip && <p className="mt-1 text-sm text-red-400">{errors.ip}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Puerto
                  </label>
                  <input
                    type="number"
                    name="port"
                    value={formData.port}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="502"
                  />
                  {errors.port && <p className="mt-1 text-sm text-red-400">{errors.port}</p>}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Puerto Serie *
                    </label>
                    <input
                      type="text"
                      name="serialPort"
                      value={formData.serialPort}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="COM1 o /dev/ttyUSB0"
                    />
                    {errors.serialPort && <p className="mt-1 text-sm text-red-400">{errors.serialPort}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Velocidad (Baud Rate) *
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
                    {errors.baudRate && <p className="mt-1 text-sm text-red-400">{errors.baudRate}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <option value="None">Ninguna</option>
                      <option value="Even">Par</option>
                      <option value="Odd">Impar</option>
                    </select>
                    {errors.parity && <p className="mt-1 text-sm text-red-400">{errors.parity}</p>}
                  </div>

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
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                    {errors.dataBits && <p className="mt-1 text-sm text-red-400">{errors.dataBits}</p>}
                  </div>

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
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                    {errors.stopBits && <p className="mt-1 text-sm text-red-400">{errors.stopBits}</p>}
                  </div>
                </div>
              </>
            )}

            {/* Configuración Modbus común */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  ID Modbus *
                </label>
                <input
                  type="number"
                  name="modbusId"
                  value={formData.modbusId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="1"
                  min="1"
                  max="247"
                />
                {errors.modbusId && <p className="mt-1 text-sm text-red-400">{errors.modbusId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Dirección Inicial *
                </label>
                <input
                  type="number"
                  name="startAddress"
                  value={formData.startAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0"
                  min="0"
                />
                {errors.startAddress && <p className="mt-1 text-sm text-red-400">{errors.startAddress}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Número de Registros *
                </label>
                <input
                  type="number"
                  name="registers"
                  value={formData.registers}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="10"
                  min="1"
                />
                {errors.registers && <p className="mt-1 text-sm text-red-400">{errors.registers}</p>}
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
              placeholder="Descripción adicional del dispositivo..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>
          </div>

          {/* Buttons */}
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
