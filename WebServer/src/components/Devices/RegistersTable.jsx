// src/components/Devices/RegistersTable.jsx
import { Edit, Trash2 } from 'lucide-react';

export default function RegistersTable({ registers, onEditRegister, onDeleteRegister }) {
  if (registers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No registers configured</p>
        <p className="text-sm">Click "Add Register" to configure Modbus registers</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-800 text-gray-400 text-sm">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Data Type</th>
            <th className="px-4 py-2">Scale</th>
            <th className="px-4 py-2">Unit</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {registers.map((register) => (
            <tr key={register.id} className="border-b border-gray-700">
              <td className="px-4 py-3">{register.name}</td>
              <td className="px-4 py-3">{register.address}</td>
              <td className="px-4 py-3 capitalize">{register.type}</td>
              <td className="px-4 py-3">{register.dataType}</td>
              <td className="px-4 py-3">{register.scale}</td>
              <td className="px-4 py-3">{register.unit}</td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditRegister(register)}
                    className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded transition-colors"
                    title="Edit register"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteRegister(register.id)}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                    title="Delete register"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
