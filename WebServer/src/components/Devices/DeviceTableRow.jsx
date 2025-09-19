// src/components/DeviceTableRow.jsx
import StatusBadge from "./StatusBadge";
import { Settings, Play, Pause, Trash2, Edit } from "lucide-react";

export default function DeviceTableRow({ device, onConfig, onConnect, onDisconnect, onDelete, onEdit }) {
  // Mostrar IP:Puerto para TCP o Puerto Serial para RTU
  const getConnectionInfo = (device) => {
    if (device.protocol === 'TCP' && device.ipAddress) {
      return `${device.ipAddress}:${device.port || 502}`;
    } else if (device.serialPort) {
      return device.serialPort;
    }
  };

  const isConnected = device.status === 'Connected';

  return (
    <tr className="border-b border-gray-700">
      <td className="px-4 py-3">{device.deviceName}</td>
      <td className="px-4 py-3">{device.deviceType}</td>
      <td className="px-4 py-3"><StatusBadge status={device.status} /></td>
      <td className="px-4 py-3">{device.modbusId}</td>
      <td className="px-4 py-3">{getConnectionInfo(device)}</td>
      <td className="px-4 py-3">{device.registers || 0}</td>
      <td className="px-4 py-3 text-gray-400">{device.lastRead || 'Never'}</td>
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <button
            onClick={onConfig}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            title="Configurar dispositivo"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onEdit(device)}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Editar dispositivo"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => isConnected ? onDisconnect(device.id) : onConnect(device.id)}
            className={`p-2 rounded-lg transition-colors ${
              isConnected 
                ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20' 
                : 'text-green-400 hover:text-green-300 hover:bg-green-900/20'
            }`}
            title={isConnected ? 'Desconectar dispositivo' : 'Conectar dispositivo'}
          >
            {isConnected ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => onDelete(device.id)}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
            title="Eliminar dispositivo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
