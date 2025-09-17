// src/components/Devices/DeviceInfoGrid.jsx

export default function DeviceInfoGrid({ device }) {
  return (
    <>
      {/* Description Section */}
      {device.description && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <label className="block text-sm text-gray-400 mb-2 font-medium">Description</label>
          <p className="text-white text-sm leading-relaxed">{device.description}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-sm text-gray-400 mb-1 font-medium">Device Name</label>
          <p className="text-white font-semibold">{device.name}</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-sm text-gray-400 mb-1 font-medium">Device Type</label>
          <p className="text-white">{device.type}</p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-sm text-gray-400 mb-1 font-medium">Modbus ID</label>
          <p className="text-white">{device.modbusId}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-sm text-gray-400 mb-1 font-medium">IP Address</label>
          <p className="text-white">{device.ipAddress || device.ip}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-sm text-gray-400 mb-1 font-medium">Port</label>
          <p className="text-white">{device.port}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-sm text-gray-400 mb-1 font-medium">Start Address</label>
          <p className="text-white">{device.startAddress}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-sm text-gray-400 mb-1 font-medium">Number of Registers</label>
          <p className="text-white">{device.registers}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <label className="block text-sm text-gray-400 mb-1 font-medium">Polling Rate</label>
          <p className="text-white">{device.pollingRate} ms</p>
        </div>

        {device.timeout && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <label className="block text-sm text-gray-400 mb-1 font-medium">Timeout</label>
            <p className="text-white">{device.timeout} ms</p>
          </div>
        )}

        {device.createdAt && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <label className="block text-sm text-gray-400 mb-1 font-medium">Created</label>
            <p className="text-white text-sm">
              {new Date(device.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
