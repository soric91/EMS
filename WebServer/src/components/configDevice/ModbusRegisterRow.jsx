import { Edit, Trash, Clock, Zap } from "lucide-react";

const ModbusRegisterRow = ({ 
    register, 
    index, 
    deviceId, 
    device, // Agregar información del dispositivo
    onEdit, 
    onDelete 
}) => {
    // Función para obtener el estado visual basado en el tipo de dispositivo
    const getRegisterTypeStyle = () => {
        if (!device) return "bg-gray-500/20 text-gray-400";
        
        const styles = {
            'inverter': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            'battery': 'bg-green-500/20 text-green-400 border-green-500/30', 
            'meter': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'sensor': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
        };
        
        return styles[device.deviceType] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    // Calcular rango de direcciones
    const endAddress = parseInt(register.startAddress) + parseInt(register.registers) - 1;

    return (
        <tr key={register.id || index} className="hover:bg-zinc-800/30 transition-colors group">
            <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded border ${getRegisterTypeStyle()} font-mono text-xs`}>
                        {register.modbusId}
                    </span>
                    {device && (
                        <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                            {device.deviceType}
                        </span>
                    )}
                </div>
            </td>
            <td className="px-3 py-2">
                <div className="flex flex-col">
                    <span className="text-zinc-300 font-mono text-sm">
                        {register.startAddress}
                    </span>
                    <span className="text-xs text-zinc-500">
                        Hasta: {endAddress}
                    </span>
                </div>
            </td>
            <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                    <span className="text-zinc-300 font-medium">
                        {register.registers}
                    </span>
                    <span className="text-xs text-zinc-500">
                        reg{register.registers !== 1 ? 's' : ''}
                    </span>
                </div>
            </td>
            <td className="px-3 py-2">
                <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getRegisterTypeStyle()}`}>
                        <Zap className="w-3 h-3 mr-1" />
                        Configurado
                    </span>
                    {register.updatedAt && (
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Clock className="w-2 h-2" />
                            {new Date(register.updatedAt).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </td>
            <td className="px-3 py-2">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={() => onEdit(register)}
                        className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all duration-200"
                        title={`Editar registro para ${device?.deviceName || 'dispositivo'}`}
                    >
                        <Edit className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => onDelete(deviceId, register.id)}
                        className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200"
                        title={`Eliminar registro de ${device?.deviceName || 'dispositivo'}`}
                    >
                        <Trash className="w-3 h-3" />
                    </button>
                </div>
                {device && (
                    <div className="text-xs text-zinc-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {device.protocol} - {device.deviceName}
                    </div>
                )}
            </td>
        </tr>
    );
};

export default ModbusRegisterRow;