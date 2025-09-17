// src/components/Devices/RegistersSection.jsx
import { Plus } from 'lucide-react';
import RegistersTable from './RegistersTable.jsx';

export default function RegistersSection({ 
  registers, 
  onAddRegister, 
  onEditRegister, 
  onDeleteRegister 
}) {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Modbus Registers</h2>
        <button
          onClick={onAddRegister}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Register</span>
        </button>
      </div>

      <RegistersTable 
        registers={registers}
        onEditRegister={onEditRegister}
        onDeleteRegister={onDeleteRegister}
      />
    </div>
  );
}
