import {  Trash, Play, Settings } from "lucide-react";
import TheadConfig from "../ui/Thead/TheadConfig";
import { Link } from "react-router-dom";
const devices = [
    {
        name: "Moises",
        type: "CT Meter",
        status: "Disconnected",
        modbusId: 1,
        address: "191.156.36.17:502",
        registers: 1,
        lastRead: "Never",
    },
    {
        name: "Moises De la rosa",
        type: "Smart Meter",
        status: "Disconnected",
        modbusId: 3,
        address: "/dev/ttyRS485",
        registers: 1,
        lastRead: "Never",
    },
];

// /edit-device-modbus/:id"

export default function DeviceTable() {
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
                            <td className="px-4 py-3">{d.name}</td>
                            <td className="px-4 py-3">{d.type}</td>
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
                            <td className="px-4 py-3">{d.address}</td>
                            <td className="px-4 py-3">{d.registers}</td>
                            <td className="px-4 py-3">{d.lastRead}</td>
                            <td className="px-4 py-3 flex gap-2">
                                <Link to={`/edit-device-modbus/${i}`}>
                                    <Settings size={18} className="cursor-pointer text-blue-400 hover:text-blue-400" />
                                </Link>
                                {d.status === "Disconnected" ? (
                                    <Play size={18} className="cursor-pointer text-green-400 hover:text-green-300" />
                                ) : (
                                    <Play size={18} className="cursor-pointer text-red-400 hover:text-red-300" />
                                )}
                                <Trash size={18} className="cursor-pointer text-red-400 hover:text-red-400" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
