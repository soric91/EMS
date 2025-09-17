// src/components/Devices/DeviceInfoCard.jsx
import { Edit, Play, Pause } from 'lucide-react';
import DeviceInfoGrid from './DeviceInfoGrid.jsx';

export default function DeviceInfoCard({ 
  device, 
  isConnected, 
  isConnecting, 
  onConnect, 
  onDisconnect, 
  onEditDevice 
}) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Device Information</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={isConnected ? onDisconnect : onConnect}
            disabled={isConnecting}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isConnecting
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : isConnected 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            } ${isConnecting ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Conectando...</span>
              </>
            ) : isConnected ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Desconectar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Conectar</span>
              </>
            )}
          </button>
          <button
            onClick={onEditDevice}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Device</span>
          </button>
        </div>
      </div>

      <DeviceInfoGrid device={device} />
    </div>
  );
}
