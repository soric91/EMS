import { Trash, Play, Settings } from "lucide-react";
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
        <div className="overflow-hidden rounded-2xl bg-gray-900 shadow">
            <table className="w-full text-sm text-gray-200">
                <TheadConfig />
                <tbody>
                    {devices.map((d, i) => (
                        <tr
                            key={i}
                            className="border-t border-gray-700 hover:bg-gray-800/60"
                        >
                            <td className="px-4 py-3">{d.deviceName}</td>
                            <td className="px-4 py-3">{d.deviceType}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${d.status === "Connected"
                                        ? "bg-green-600/20 text-green-400"
                                        : "bg-red-600/20 text-red-400"
                                        }`}
                                >
                                    {d.status}
                                </span>
                            </td>
                            <td className="px-4 py-3">{d.modbusId}</td>
                            <td className="px-4 py-3">{getConnectionInfo(d)}</td>
                            <td className="px-4 py-3">{d.registers}</td>
                            <td className="px-4 py-3">{d.lastRead}</td>
                            <td className="px-4 py-3 flex gap-2">
                                <Link to={`/edit-device-modbus/${d.id}`}>
                                    <Settings size={18} className="cursor-pointer text-blue-400 hover:text-blue-400" />
                                </Link>
                                {d.status === "Disconnected" ? (
                                    <Play size={18} className="cursor-pointer text-green-400 hover:text-green-300" />
                                ) : (
                                    <Play size={18} className="cursor-pointer text-red-400 hover:text-red-300" />
                                )}
                                <Trash size={18} className="cursor-pointer text-red-400 hover:text-red-400" onClick={() => openModal(d)} />
                            </td>
                        </tr>
                    ))}
                </tbody>


            </table>

            <ConfirmDeleteModal  
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={() => confirmDelete(selectedDevice.id)}
            />

        </div>
    );
}
