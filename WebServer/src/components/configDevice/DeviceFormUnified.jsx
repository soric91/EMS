import { useState, useEffect } from 'react';
import { X, Server, Network, CheckCircle, ChevronLeft, ChevronRight, ArrowLeft, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDeviceForm from "../../hooks/device/useDeviceForm";
import AddModbusRegisterModal from './AddModbusRegisterModal.jsx';

const steps = [
  { id: 1, name: 'Información Básica', icon: Server },
  { id: 2, name: 'Conexión', icon: Network },
  { id: 3, name: 'Confirmación', icon: CheckCircle },
  { id: 4, name: 'Registros Modbus', icon: Database }
];

/**
 * Componente unificado para formularios de dispositivos
 * Funciona tanto como modal como página completa
 * 
 * @param {Object} props
 * @param {'modal'|'page'} props.mode - Modo de presentación
 * @param {boolean} props.isOpen - Si está abierto (solo para modo modal)
 * @param {Function} props.onClose - Callback de cierre (solo para modo modal)
 * @param {Object|null} props.device - Dispositivo a editar (null para crear nuevo)
 * @param {Function} props.onSave - Callback después de guardar exitosamente
 * @param {boolean} props.embedded - Si está embebido en otra página
 */
export default function DeviceFormUnified({ 
  mode = 'modal',
  isOpen = true,
  onClose,
  device = null,
  onSave,
  embedded = false
}) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdDeviceId, setCreatedDeviceId] = useState(null);
  const [deviceRegisters, setDeviceRegisters] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editingRegister, setEditingRegister] = useState(null);
  
  const {
    register,
    handleSubmit,
    protocol,
    setProtocol,
    onSubmit: originalOnSubmit,
    formState,
    resetForm,
    setValue,
    getValues
  } = useDeviceForm(handleFormClose);
  
  // Configurar valores iniciales si estamos editando
  useEffect(() => {
    if (device && setValue) {
      setValue('deviceName', device.deviceName || '');
      setValue('deviceType', device.deviceType || '');
      setValue('description', device.description || '');
      setValue('protocol', device.protocol || 'TCP');
      setValue('ipAddress', device.ipAddress || '');
      setValue('port', device.port || 502);
      setValue('serialPort', device.serialPort || '');
      setValue('baudRate', device.baudRate || '9600');
      setValue('dataBits', device.dataBits || '8');
      setValue('parity', device.parity || 'N');
      setValue('stopBits', device.stopBits || '1');
      setProtocol(device.protocol || 'TCP');
    }
  }, [device, setValue, setProtocol]);

  // Función personalizada de submit que captura el ID del dispositivo creado
  const handleDeviceSubmit = async (data) => {
    const result = await originalOnSubmit(data);
    
    // Si se creó un dispositivo nuevo, capturar su ID
    if (!device && result && result.deviceId) {
      setCreatedDeviceId(result.deviceId);
      setCurrentStep(3); // Ir al paso de confirmación
      return result;
    }
    
    // Si es edición, proceder normalmente
    if (device) {
      handleFormClose();
      return result;
    }
  };

  // Funciones para manejar registros
  const handleAddRegister = () => {
    setEditingRegister(null);
    setShowRegisterModal(true);
  };

  const handleEditRegister = (register) => {
    setEditingRegister(register);
    setShowRegisterModal(true);
  };

  const handleSaveRegister = (registerData) => {
    if (editingRegister) {
      // Editar registro existente
      setDeviceRegisters(prev => 
        prev.map(reg => reg.id === editingRegister.id ? registerData : reg)
      );
    } else {
      // Agregar nuevo registro
      setDeviceRegisters(prev => [...prev, registerData]);
    }
    setShowRegisterModal(false);
    setEditingRegister(null);
  };

  const handleDeleteRegister = (registerId) => {
    setDeviceRegisters(prev => prev.filter(reg => reg.id !== registerId));
  };

  const handleFinishConfiguration = () => {
    // Finalizar configuración y cerrar
    handleFormClose();
  };

  // Safe access to errors with fallback
  const errors = formState?.errors || {};
  
  // No renderizar si es modal y no está abierto
  if (mode === 'modal' && !isOpen) return null;

  function handleFormClose() {
    if (mode === 'page') {
      // En modo página, navegar de regreso
      if (device) {
        navigate(`/devices/${device.id}`);
      } else {
        navigate('/devices');
      }
    } else {
      // En modo modal, usar callback de cierre
      if (onClose) onClose();
    }
    
    // Ejecutar callback de guardado si existe
    if (onSave) onSave();
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    resetForm();
    handleFormClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Nombre del Dispositivo *
                </label>
                <input
                  {...register("deviceName", { 
                    required: "El nombre es requerido",
                    minLength: { value: 3, message: "Mínimo 3 caracteres" }
                  })}
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all duration-200"
                  placeholder="Ej: Inversor Principal"
                />
                {errors.deviceName && (
                  <p className="text-red-400 text-sm">{errors.deviceName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Tipo de Dispositivo *
                </label>
                <select
                  {...register("deviceType", { required: "Selecciona un tipo" })}
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all duration-200"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="inverter">Inversor</option>
                  <option value="battery">Batería</option>
                  <option value="meter">Medidor</option>
                  <option value="sensor">Sensor</option>
                  <option value="other">Otro</option>
                </select>
                {errors.deviceType && (
                  <p className="text-red-400 text-sm">{errors.deviceType.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Descripción
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all duration-200 resize-none"
                placeholder="Descripción opcional del dispositivo..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Protocol Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-zinc-300">
                Protocolo de Comunicación *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['TCP', 'RTU'].map((prot) => (
                  <button
                    key={prot}
                    type="button"
                    onClick={() => setProtocol(prot)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      protocol === prot
                        ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                        : 'border-zinc-700/50 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600/50 hover:bg-zinc-700/30'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">Modbus {prot}</div>
                      <div className="text-sm opacity-75 mt-1">
                        {prot === 'TCP' ? 'Ethernet/WiFi' : 'Serial RS485'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Protocol-specific fields */}
            {protocol === 'TCP' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Dirección IP *
                  </label>
                  <input
                    {...register("ipAddress", { 
                      required: "La IP es requerida",
                      pattern: {
                        value: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                        message: "IP inválida"
                      }
                    })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all duration-200"
                    placeholder="192.168.1.100"
                  />
                  {errors.ipAddress && (
                    <p className="text-red-400 text-sm">{errors.ipAddress.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Puerto
                  </label>
                  <input
                    {...register("port", { 
                      min: { value: 1, message: "Puerto mínimo: 1" },
                      max: { value: 65535, message: "Puerto máximo: 65535" }
                    })}
                    type="number"
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all duration-200"
                    placeholder="502"
                  />
                  {errors.port && (
                    <p className="text-red-400 text-sm">{errors.port.message}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Puerto Serial *
                  </label>
                  <input
                    {...register("serialPort", { required: "El puerto serial es requerido" })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all duration-200"
                    placeholder="/dev/ttyUSB0"
                  />
                  {errors.serialPort && (
                    <p className="text-red-400 text-sm">{errors.serialPort.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Baud Rate
                  </label>
                  <select
                    {...register("baudRate")}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-all duration-200"
                  >
                    <option value="9600">9600</option>
                    <option value="19200">19200</option>
                    <option value="38400">38400</option>
                    <option value="57600">57600</option>
                    <option value="115200">115200</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {device ? 'Dispositivo Actualizado' : '¡Dispositivo Creado!'}
                </h3>
                <p className="text-zinc-400 mb-4">
                  {device 
                    ? 'Los cambios se han guardado correctamente'
                    : 'Ahora vamos a configurar los registros Modbus específicos para este dispositivo'
                  }
                </p>
              </div>
              
              {!device && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <h4 className="text-lg font-medium text-blue-400 mb-2">
                    Siguiente paso: Registros Modbus
                  </h4>
                  <p className="text-sm text-zinc-400 mb-3">
                    Configura los registros Modbus específicos para tu dispositivo {protocol === 'TCP' ? 'Modbus TCP' : 'Modbus RTU'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)} // Agregar paso 4
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Configurar Registros Modbus
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Configurar Registros Modbus
              </h3>
              <p className="text-zinc-400">
                Agrega los registros específicos para tu dispositivo {getValues('deviceName')}
              </p>
            </div>
            
            <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-white">
                  Registros Configurados ({deviceRegisters.length})
                </h4>
                <button
                  type="button"
                  onClick={handleAddRegister}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Database className="w-4 h-4" />
                  <span>Agregar Registro</span>
                </button>
              </div>
              
              {/* Lista de registros agregados */}
              {deviceRegisters.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
                  <div className="text-sm text-zinc-400 mb-3">
                    No hay registros configurados aún.
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRegister}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    Agregar primer registro Modbus
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {deviceRegisters.map((register, index) => (
                    <div key={register.id} className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg font-mono text-sm">
                            ID: {register.modbusId}
                          </div>
                          <div className="text-sm text-zinc-300">
                            <span className="font-medium">Addr:</span> {register.startAddress}
                          </div>
                          <div className="text-sm text-zinc-300">
                            <span className="font-medium">Regs:</span> {register.registers}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditRegister(register)}
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Editar registro"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRegister(register.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Eliminar registro"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {deviceRegisters.length > 0 && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-green-400">
                      ✅ {deviceRegisters.length} registro(s) configurado(s)
                    </div>
                    <button
                      type="button"
                      onClick={handleFinishConfiguration}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Finalizar Configuración
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Wrapper content
  const formContent = (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {mode === 'page' && (
            <button
              onClick={handleClose}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-white">
              {device ? 'Editar Dispositivo' : 'Agregar Dispositivo'}
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              {steps[currentStep - 1]?.name}
            </p>
          </div>
        </div>
        {mode === 'modal' && (
          <button
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id
                ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                : 'border-zinc-600 bg-zinc-800 text-zinc-500'
            }`}>
              <step.icon className="w-5 h-5" />
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 ml-4 ${
                currentStep > step.id ? 'bg-blue-500' : 'bg-zinc-600'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit(handleDeviceSubmit)} className="space-y-8">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-zinc-700/50">
          <div>
            {currentStep > 1 && currentStep < 4 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center space-x-2 px-6 py-2.5 text-zinc-400 hover:text-white border border-zinc-600/50 rounded-xl hover:border-zinc-500/50 hover:bg-zinc-700/30 transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            )}
            {currentStep === 4 && (
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center space-x-2 px-6 py-2.5 text-zinc-400 hover:text-white border border-zinc-600/50 rounded-xl hover:border-zinc-500/50 hover:bg-zinc-700/30 transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-zinc-400 hover:text-white border border-zinc-600/50 rounded-xl hover:border-zinc-500/50 hover:bg-zinc-700/30 transition-all duration-200"
            >
              Cancelar
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : currentStep === 3 && !device ? (
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/25"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Crear Dispositivo</span>
              </button>
            ) : currentStep === 3 && device ? (
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/25"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Actualizar Dispositivo</span>
              </button>
            ) : currentStep === 4 && deviceRegisters.length === 0 ? (
              <button
                type="button"
                onClick={handleFinishConfiguration}
                className="flex items-center space-x-2 px-6 py-2.5 bg-zinc-600 hover:bg-zinc-500 text-white rounded-xl transition-all duration-200"
              >
                <span>Saltar Registros</span>
              </button>
            ) : null}
          </div>
        </div>
      </form>

      {/* Modal de registro Modbus */}
      {showRegisterModal && (
        <AddModbusRegisterModal
          isOpen={showRegisterModal}
          onClose={() => {
            setShowRegisterModal(false);
            setEditingRegister(null);
          }}
          deviceId={createdDeviceId}
          device={{
            ...getValues(),
            deviceType: getValues('deviceType'),
            protocol: protocol,
            id: createdDeviceId
          }}
          editRegister={editingRegister}
          onSave={handleSaveRegister}
        />
      )}
    </div>
  );

  // Renderizar según el modo
  if (mode === 'page') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 backdrop-blur-sm rounded-2xl border border-zinc-700/30 p-8">
            {formContent}
          </div>
        </div>
      </div>
    );
  }

  // Mode: modal (default)
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-sm rounded-2xl border border-zinc-700/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {formContent}
        </div>
      </div>
    </div>
  );
}