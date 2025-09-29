import { Hash, Settings2, Database } from "lucide-react";

const ModbusTableHeader = ({ showActions = true }) => {
    return (
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
                <th className="text-left px-3 py-2 text-zinc-400 font-medium">
                    Estado
                </th>
                {showActions && (
                    <th className="text-left px-3 py-2 text-zinc-400 font-medium">
                        Acciones
                    </th>
                )}
            </tr>
        </thead>
    );
};

export default ModbusTableHeader;