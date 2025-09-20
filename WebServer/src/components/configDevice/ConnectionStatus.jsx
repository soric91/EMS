// src/components/Devices/ConnectionStatus.jsx
import { Wifi, WifiOff } from 'lucide-react';

export default function ConnectionStatus({ connectionStatus }) {
  
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
