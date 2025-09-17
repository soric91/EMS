// src/components/Devices/ConnectionStatus.jsx
import { Wifi, WifiOff } from 'lucide-react';

export default function ConnectionStatus({ connectionStatus, isConnecting }) {
  if (isConnecting) {
    return (
      <div className="flex items-center space-x-2 bg-blue-900 text-blue-200 px-3 py-2 rounded-lg">
        <div className="w-4 h-4 border-2 border-blue-200 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Connecting...</span>
      </div>
    );
  }

  const isConnected = connectionStatus === 'Connected';

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
      isConnected 
        ? 'bg-green-900 text-green-200' 
        : 'bg-red-900 text-red-200'
    }`}>
      {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
      <span className="text-sm font-medium">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}
