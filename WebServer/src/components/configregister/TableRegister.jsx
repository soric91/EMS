
import { Edit2, Trash2, Hash, Type, Database, Scale, Tag } from 'lucide-react';

function TableRegister({ registers, handleEditRegister, handleDeleteRegister }) {
  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'input':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'holding':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'coil':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'discrete':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getDataTypeColor = (dataType) => {
    switch (dataType?.toLowerCase()) {
      case 'int16':
      case 'int32':
        return 'bg-emerald-500/20 text-emerald-300';
      case 'uint16':
      case 'uint32':
        return 'bg-cyan-500/20 text-cyan-300';
      case 'float32':
      case 'double':
        return 'bg-pink-500/20 text-pink-300';
      case 'bool':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 border-b border-gray-600/50">
            <th className="px-6 py-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-400" />
                Name
              </div>
            </th>
            <th className="px-6 py-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-green-400" />
                Address
              </div>
            </th>
            <th className="px-6 py-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-purple-400" />
                Type
              </div>
            </th>
            <th className="px-6 py-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-orange-400" />
                Data Type
              </div>
            </th>
            <th className="px-6 py-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                Scale
              </div>
            </th>
            <th className="px-6 py-4 text-gray-300 font-semibold text-sm uppercase tracking-wider">Unit</th>
            <th className="px-6 py-4 text-gray-300 font-semibold text-sm uppercase tracking-wider text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
          {registers.map((register, index) => (
            <tr 
              key={register.id} 
              className={`group hover:bg-gray-700/30 transition-all duration-200 ${
                index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/10'
              }`}
            >
              <td className="px-6 py-4">
                <div className="font-medium text-white group-hover:text-blue-300 transition-colors">
                  {register.name}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono bg-gray-700/50 text-green-300 border border-gray-600/50">
                  {register.address}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getTypeColor(register.type)}`}>
                  {register.type}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getDataTypeColor(register.dataType)}`}>
                  {register.dataType}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-300 font-mono text-sm">
                  {register.scale || '1'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-gray-400 text-sm">
                  {register.unit || '-'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center space-x-1">
                  <button
                    onClick={() => handleEditRegister(register)}
                    className="group/btn p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all duration-200 hover:scale-105 border border-blue-500/20 hover:border-blue-500/40"
                    title="Edit register"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRegister(register.id)}
                    className="group/btn p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 hover:scale-105 border border-red-500/20 hover:border-red-500/40"
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
  )
}

export default TableRegister