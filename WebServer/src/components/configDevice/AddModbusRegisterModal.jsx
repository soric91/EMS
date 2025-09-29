import React from 'react';
import { X, Settings, Plus, Edit } from 'lucide-react';
import { createPortal } from 'react-dom';
import useModbusRegisterForm from "../../hooks/device/useModbusRegisterForm";

export default function AddModbusRegisterModal({ isOpen, onClose, deviceId, editRegister = null }) {
  const {
    register,
    handleSubmit,
    onSubmit,
    formState,
    resetForm
  } = useModbusRegisterForm(deviceId, onClose, editRegister);
  
  const errors = formState?.errors || {};

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const isEditing = editRegister !== null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/50 text-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800/50 bg-zinc-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                {isEditing ? <Edit className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {isEditing ? 'Editar Registro Modbus' : 'Agregar Registro Modbus'}
                </h2>
                <p className="text-sm text-zinc-400">
                  {isEditing ? 'Modifica la configuración del registro' : 'Configura un nuevo registro para el dispositivo'}
                </p>
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

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">
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

          {/* Footer */}
          <div className="px-6 py-4 bg-zinc-800/20 border-t border-zinc-800/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-600/50 hover:text-white transition-all duration-200"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
            >
              {isEditing ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isEditing ? 'Actualizar Registro' : 'Crear Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}