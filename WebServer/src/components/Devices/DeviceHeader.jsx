// src/components/Devices/DeviceHeader.jsx
import { ArrowLeft } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus.jsx';

export default function DeviceHeader({ device, connectionStatus, isConnecting, onNavigateBack }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onNavigateBack}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3">
          <ConnectionStatus 
            connectionStatus={connectionStatus}
            isConnecting={isConnecting}
          />
          <div>
            <h1 className="text-2xl font-bold">{device.name}</h1>
            <p className="text-gray-400">Modbus ID: {device.modbusId} | {device.type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
