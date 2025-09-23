
import { Hash, Database, Settings2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ModbusInfoTable({ infoModbus = [], idDevice }) {
    if (!infoModbus || infoModbus.length === 0) {
        return (
            <div className="px-6 py-4 text-center text-zinc-500">
                No hay registros Modbus configurados
            </div>
        );
    }

    return (
        <div className="px-6 py-4 bg-zinc-900/50 border-t border-zinc-700/30">
            <div className="mb-3">
                <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    Registros Modbus ({infoModbus.length})
                </h4>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-zinc-700/50">
                            <th className="text-left px-3 py-2 text-zinc-400 font-medium">
                                <div className="flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    Modbus ID
                                </div>
                            </th>
                            <th className="text-left px-3 py-2 text-zinc-400 font-medium">
                                <div className="flex items-center gap-1">
                                    <Settings2 className="w-3 h-3" />
                                    Dirección Inicial
                                </div>
                            </th>
                            <th className="text-left px-3 py-2 text-zinc-400 font-medium">
                                <div className="flex items-center gap-1">
                                    <Database className="w-3 h-3" />
                                    Registros
                                </div>
                            </th>
                            
                            <th className="text-left px-3 py-2 text-zinc-400 font-medium">Estado</th>
                            <th className="text-left px-3 py-2 text-zinc-400 font-medium">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-700/30">
                        {infoModbus.map((register, index) => (
                            <tr key={register.id || index} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="px-3 py-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-mono text-xs">
                                        {register.modbusId}
                                    </span>
                                </td>
                                <td className="px-3 py-2">
                                    <span className="text-zinc-300 font-mono">
                                        {register.startAddress}
                                    </span>
                                </td>
                                <td className="px-3 py-2">
                                    <span className="text-zinc-300">
                                        {register.registers}
                                    </span>
                                </td>
                                <td className="px-3 py-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                                        Configurado
                                    </span>
                                </td>
                                <td className="px-3 py-2">
                                    <Link to={`/edit-device-modbus/${idDevice}/${register.id}`}>
                                        <button className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all duration-200">
                                            <Settings size={16} />
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}