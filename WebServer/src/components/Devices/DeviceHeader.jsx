// src/components/Devices/DeviceHeader.jsx
import { ArrowLeft, Server, Hash } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus.jsx';

export default function DeviceHeader({ device, isConnecting, onNavigateBack }) {
  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onNavigateBack}
            className="p-3 text-gray-400 hover:text-white rounded-xl hover:bg-gray-700/50 transition-all duration-200 hover:scale-105 border border-gray-600/30 hover:border-gray-500/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-4">
            <ConnectionStatus 
              connectionStatus={device.status}
              isConnecting={isConnecting}
            />
            <div className="border-l border-gray-600/50 pl-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {device.deviceName}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Hash className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Modbus ID: {device.modbusId}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Server className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium">{device.deviceType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
