// src/components/DeviceTable.jsx
import DeviceTableRow from "./DeviceTableRow";

export default function DeviceTable({ devices, onConfigDevice, onConnect, onDisconnect, onDelete, onEdit }) {
  return (
    <div className="overflow-hidden rounded-xl bg-gray-900 shadow-lg">
      <table className="w-full text-left text-gray-300">
        <thead className="bg-gray-800 text-gray-400 text-sm">
          <tr>
            <th className="px-4 py-2">Device Name</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Modbus ID</th>
            <th className="px-4 py-2">IP Address/Port Serial</th>
            <th className="px-4 py-2">Registers</th>
            <th className="px-4 py-2">Last Read</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d, index) => (
            <DeviceTableRow 
              key={d.id || index} 
              device={d} 
              onConfig={() => onConfigDevice(d, index)}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
