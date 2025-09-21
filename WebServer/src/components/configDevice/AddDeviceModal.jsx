import { useState } from 'react';
import { X, Server, Network, Settings, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import useDeviceForm from "../../hooks/device/useDeviceForm";

const steps = [
  { id: 1, name: 'Información Básica', icon: Server },
  { id: 2, name: 'Conexión', icon: Network },
  { id: 3, name: 'Configuración Modbus', icon: Settings },
  { id: 4, name: 'Finalizar', icon: CheckCircle }
];

export default function AddDeviceModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const {
    register,
    handleSubmit,
    protocol,
    setProtocol,
    onSubmit,
    formState,
    resetForm
  } = useDeviceForm(onClose);
  
  // Safe access to errors with fallback
  const errors = formState?.errors || {};

  if (!isOpen) return null;

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
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Nombre del Dispositivo *
              </label>
              <input
                {...register("deviceName", { required: "El nombre es requerido" })}
                type="text"
                placeholder="Ej: Medidor Principal"
                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200"
              />
              {errors.deviceName && (
                <p className="mt-1 text-sm text-red-400">{errors.deviceName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Tipo de Dispositivo *
              </label>
              <select
                {...register("deviceType", { required: "El tipo es requerido" })}
                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200"
              >
                <option value="">Seleccionar tipo...</option>
                <option value="CT Meter">CT Meter</option>
                <option value="Smart Meter">Smart Meter</option>
                <option value="Energy Monitor">Energy Monitor</option>
                <option value="Power Analyzer">Power Analyzer</option>
              </select>
              {errors.deviceType && (
                <p className="mt-1 text-sm text-red-400">{errors.deviceType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Descripción
              </label>
              <textarea
                {...register("description")}
                rows="3"
                placeholder="Descripción del dispositivo (opcional)..."
                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200 resize-none"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Protocolo de Comunicación *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setProtocol('TCP')}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    protocol === 'TCP'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-zinc-700/50 bg-zinc-800/30 text-zinc-300 hover:border-zinc-600/50'
                  }`}
                >
                  <div className="font-medium mb-1">Modbus TCP</div>
                  <div className="text-xs opacity-70">Comunicación por Ethernet</div>
                </button>
                <button
                  type="button"
                  onClick={() => setProtocol('RTU')}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    protocol === 'RTU'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-zinc-700/50 bg-zinc-800/30 text-zinc-300 hover:border-zinc-600/50'
                  }`}
                >
                  <div className="font-medium mb-1">Modbus RTU</div>
                  <div className="text-xs opacity-70">Comunicación Serial</div>
                </button>
              </div>
            </div>

            {protocol === 'TCP' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Dirección IP *
                    </label>
                    <input
                      {...register("ipAddress", { 
                        required: protocol === 'TCP' ? "La IP es requerida" : false,
                        pattern: {
                          value: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                          message: "Formato de IP inválido"
                        }
                      })}
                      type="text"
                      placeholder="192.168.1.100"
                      className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200"
                    />
                    {errors.ipAddress && (
                      <p className="mt-1 text-sm text-red-400">{errors.ipAddress.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Puerto *
                    </label>
                    <input
                      {...register("port", { 
                        required: protocol === 'TCP' ? "El puerto es requerido" : false,
                        min: { value: 1, message: "Puerto mínimo: 1" },
                        max: { value: 65535, message: "Puerto máximo: 65535" }
                      })}
                      type="number"
                      defaultValue={502}
                      className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200"
                    />
                    {errors.port && (
                      <p className="mt-1 text-sm text-red-400">{errors.port.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Puerto Serial *
                  </label>
                  <input
                    {...register("serialPort", { 
                      required: protocol === 'RTU' ? "El puerto serial es requerido" : false 
                    })}
                    type="text"
                    placeholder="/dev/ttyUSB0 o COM1"
                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200"
                  />
                  {errors.serialPort && (
                    <p className="mt-1 text-sm text-red-400">{errors.serialPort.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Velocidad (bps) *
                    </label>
                    <select
                      {...register("baudRate", { 
                        required: protocol === 'RTU' ? "La velocidad es requerida" : false 
                      })}
                      className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="9600">9600</option>
                      <option value="19200">19200</option>
                      <option value="38400">38400</option>
                      <option value="57600">57600</option>
                      <option value="115200">115200</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Bits de Datos *
                    </label>
                    <select
                      {...register("dataBits", { 
                        required: protocol === 'RTU' ? "Los bits de datos son requeridos" : false 
                      })}
                      className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="8">8 bits</option>
                      <option value="7">7 bits</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Paridad *
                    </label>
                    <select
                      {...register("parity", { 
                        required: protocol === 'RTU' ? "La paridad es requerida" : false 
                      })}
                      className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="N">Sin paridad</option>
                      <option value="E">Par</option>
                      <option value="O">Impar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Bits de Parada *
                    </label>
                    <select
                      {...register("stopBits", { 
                        required: protocol === 'RTU' ? "Los bits de parada son requeridos" : false 
                      })}
                      className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="1">1 bit</option>
                      <option value="2">2 bits</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  ID Modbus *
                </label>
                <input
                  {...register("modbusId", { 
                    required: "El ID Modbus es requerido",
                    min: { value: 1, message: "Mínimo: 1" },
                    max: { value: 255, message: "Máximo: 255" }
                  })}
                  type="number"
                  defaultValue={1}
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200"
                />
                {errors.modbusId && (
                  <p className="mt-1 text-sm text-red-400">{errors.modbusId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Dirección Inicial *
                </label>
                <input
                  {...register("startAddress", { 
                    required: "La dirección inicial es requerida",
                    min: { value: 0, message: "Mínimo: 0" }
                  })}
                  type="number"
                  defaultValue={0}
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200"
                />
                {errors.startAddress && (
                  <p className="mt-1 text-sm text-red-400">{errors.startAddress.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Número de Registros *
                </label>
                <input
                  {...register("registers", { 
                    required: "El número de registros es requerido",
                    min: { value: 1, message: "Mínimo: 1" },
                    max: { value: 125, message: "Máximo: 125" }
                  })}
                  type="number"
                  defaultValue={10}
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all duration-200"
                />
                {errors.registers && (
                  <p className="mt-1 text-sm text-red-400">{errors.registers.message}</p>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-zinc-800/30 border border-zinc-700/30 rounded-xl">
              <h4 className="text-sm font-medium text-zinc-300 mb-2">Información sobre Registros Modbus</h4>
              <div className="text-xs text-zinc-500 space-y-1">
                <p>• <strong>ID Modbus:</strong> Identificador único del dispositivo esclavo (1-255)</p>
                <p>• <strong>Dirección Inicial:</strong> Primera dirección de registro a leer</p>
                <p>• <strong>Número de Registros:</strong> Cantidad de registros consecutivos a leer</p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">¡Listo para Crear!</h3>
              <p className="text-zinc-400">
                Revisa la configuración y haz clic en "Crear Dispositivo" para finalizar.
              </p>
            </div>
            <div className="text-left bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-4 space-y-3">
              <h4 className="font-medium text-zinc-300">Resumen de Configuración:</h4>
              <div className="text-sm text-zinc-400 space-y-2">
                <div className="flex justify-between">
                  <span>Protocolo:</span>
                  <span className="text-white">{protocol === 'TCP' ? 'Modbus TCP' : 'Modbus RTU'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conexión:</span>
                  <span className="text-white">
                    {protocol === 'TCP' ? 'Ethernet' : 'Serial'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ID Modbus:</span>
                  <span className="text-white">1</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/50 text-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3 border-b border-zinc-800/50 bg-zinc-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                <Server className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-semibold">Agregar Dispositivo Modbus</h2>
                <p className="text-xs text-zinc-400">Paso {currentStep} de {steps.length}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-zinc-800/20">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-zinc-600 text-zinc-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 md:w-16 h-0.5 mx-2 transition-colors duration-200 ${
                      isCompleted ? 'bg-green-500' : 'bg-zinc-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-zinc-500">
            {steps.map(step => (
              <span key={step.id} className={`${currentStep === step.id ? 'text-blue-400' : ''}`}>
                {step.name}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-4 min-h-[320px] max-h-[400px] overflow-y-auto">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-zinc-800/20 border-t border-zinc-800/50 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentStep === 1
                  ? 'text-zinc-500 cursor-not-allowed'
                  : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg border border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-600/50 hover:text-white transition-all duration-200"
              >
                Cancelar
              </button>
              
              {currentStep === steps.length ? (
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-green-500/25 transition-all duration-200"
                >
                  <CheckCircle className="w-4 h-4" />
                  Crear Dispositivo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium transition-all duration-200"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
