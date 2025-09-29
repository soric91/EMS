import { Edit, Trash } from "lucide-react";

const ModbusRegisterRow = ({ 
    register, 
    index, 
    deviceId, 
    onEdit, 
    onDelete 
}) => {
    return (
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
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(register)}
                        className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all duration-200"
                        title="Editar registro"
                    >
                        <Edit className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => onDelete(deviceId, register.id)}
                        className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200"
                        title="Eliminar registro"
                    >
                        <Trash className="w-3 h-3" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default ModbusRegisterRow;