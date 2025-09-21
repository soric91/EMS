import { Trash, Play, Settings, Database } from "lucide-react";
import TheadConfig from "../ui/Thead/TheadConfig";
import { Link } from "react-router-dom";
import { useGlobalDevice } from "../../context/GlobalDevice";
import ConfirmDeleteModal from  "./ConfirmDeleteModal.jsx"
import { useDeleteDeviceModal } from "../../hooks/device/useModalState.js";
// /edit-device-modbus/:id"

export default function DeviceTable() {
    const { devices } = useGlobalDevice();
    console.log("Devices in DeviceTable:", devices);

    const {
    isModalOpen,
    selectedDevice,
    openModal,
    closeModal,
    confirmDelete,
  } = useDeleteDeviceModal();

    const getConnectionInfo = (device) => {
        if (device.protocol === 'TCP' && device.ipAddress) {
            return `${device.ipAddress}:${device.port || 502}`;
        } else if (device.serialPort) {
            return device.serialPort;
        }
    };
    return (
        <div className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <TheadConfig />
                    <tbody className="divide-y divide-zinc-700/30">
                        {devices.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className="p-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/30">
                                            <Database className="w-8 h-8 text-zinc-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-zinc-300 mb-2">No hay dispositivos</h3>
                                            <p className="text-sm text-zinc-500 max-w-md">
                                                Comienza agregando tu primer dispositivo para comenzar el monitoreo energético.
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            devices.map((d, i) => (
                            <tr
                                key={i}
                                className="group hover:bg-zinc-800/30 transition-all duration-200"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                                            <span className="text-xs font-bold text-blue-400">
                                                {d.deviceName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{d.deviceName}</p>
                                            <p className="text-xs text-zinc-400">ID: {d.modbusId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-700/50 text-zinc-300 border border-zinc-600/30">
                                        {d.deviceType}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${
                                            d.status === "Connected" 
                                                ? "bg-green-400 animate-pulse" 
                                                : "bg-red-400"
                                        }`} />
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold ${
                                            d.status === "Connected"
                                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                        }`}>
                                            {d.status === "Connected" ? "CONECTADO" : "DESCONECTADO"}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-zinc-300 font-mono text-sm">
                                        {getConnectionInfo(d)}
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-0.5">
                                        {d.protocol === 'TCP' ? 'Modbus TCP' : 'Modbus RTU'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-zinc-300">{d.registers}</td>
                                <td className="px-6 py-4">
                                    <div className="text-zinc-300 text-sm">{d.lastRead}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Link to={`/edit-device-modbus/${d.id}`}>
                                            <button className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all duration-200">
                                                <Settings size={16} />
                                            </button>
                                        </Link>
                                        <button 
                                            className={`p-2 rounded-lg border transition-all duration-200 ${
                                                d.status === "Disconnected" 
                                                    ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20 hover:border-green-500/30"
                                                    : "bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/30"
                                            }`}
                                            title={d.status === "Disconnected" ? "Conectar" : "Pausar"}
                                        >
                                            <Play size={16} />
                                        </button>
                                        <button 
                                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200"
                                            onClick={() => openModal(d)}
                                            title="Eliminar dispositivo"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmDeleteModal  
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={() => confirmDelete(selectedDevice.id)}
            />

        </div>
    );
}
