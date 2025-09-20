// src/components/Devices/DeviceInfoCard.jsx
import { Edit, Info, Settings } from 'lucide-react';
import DeviceInfoGrid from './DeviceInfoGrid.jsx';

export default function DeviceInfoCard({ 
  device, 
 
  onEditDevice 
}) {
  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Device Information</h2>
            <p className="text-gray-400 text-sm">Device configuration and settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onEditDevice}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-500/90 hover:to-indigo-500/90 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105 border border-blue-500/30 hover:border-blue-400/50"
          >
            <Edit className="w-4 h-4" />
            <span className="font-medium">Edit Device</span>
          </button>
        </div>
      </div>

      <DeviceInfoGrid device={device} />
    </div>
  );
}
