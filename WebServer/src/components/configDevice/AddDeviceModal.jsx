import useDeviceForm from "../../hooks/useDeviceForm";

export default function AddDeviceModal({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    protocol,
    setProtocol,
    onSubmit,
  } = useDeviceForm(onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gray-900 text-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative">
        <h2 className="text-lg font-bold mb-4">Añadir Dispositivo Modbus</h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm mb-1">Nombre del Dispositivo *</label>
            <input
              {...register("deviceName", { required: true })}
              type="text"
              placeholder="Ej: Medidor Principal"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm mb-1">Tipo de Dispositivo *</label>
            <select
              {...register("deviceType", { required: true })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
            >
              <option>CT Meter</option>
              <option>Smart Meter</option>
            </select>
          </div>

          {/* Protocolo */}
          <div>
            <label className="block text-sm mb-1">Protocolo *</label>
            <select
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
            >
              <option value="TCP">Modbus TCP</option>
              <option value="RTU">Modbus RTU</option>
            </select>
          </div>

          {/* Configuración por protocolo */}
          {protocol === "TCP" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Dirección IP *</label>
                <input
                  {...register("ipAddress", { required: true })}
                  type="text"
                  placeholder="192.168.1.100"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Puerto *</label>
                <input
                  {...register("port", { required: true })}
                  type="number"
                  defaultValue={502}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm mb-1">Puerto Serial *</label>
                <input
                  {...register("serialPort", { required: true })}
                  type="text"
                  placeholder="/dev/ttyUSB0 o COM1"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Velocidad (bps) *</label>
                  <select
                    {...register("baudRate", { required: true })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                  >
                    <option>9600</option>
                    <option>19200</option>
                    <option>38400</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Bits de Datos *</label>
                  <select
                    {...register("dataBits", { required: true })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                  >
                    <option>8 bits</option>
                    <option>7 bits</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Paridad *</label>
                  <select
                    {...register("parity", { required: true })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                  >
                    <option>Sin paridad</option>
                    <option>Par</option>
                    <option>Impar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Bits de Parada *</label>
                  <select
                    {...register("stopBits", { required: true })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                  >
                    <option>1 bit</option>
                    <option>2 bits</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Configuración Modbus */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">ID Modbus *</label>
              <input
                {...register("modbusId", { required: true })}
                type="number"
                defaultValue={1}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Dirección Inicial *</label>
              <input
                {...register("startAddress", { required: true })}
                type="number"
                defaultValue={0}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Número de Registros *</label>
              <input
                {...register("registers", { required: true })}
                type="number"
                defaultValue={10}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm mb-1">Descripción *</label>
            <textarea
              {...register("description")}
              rows="2"
              placeholder="Descripción del dispositivo..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
            ></textarea>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500"
            >
              Guardar Dispositivo
            </button>
          </div>
        </form>

        {/* Botón cerrar arriba derecha */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
