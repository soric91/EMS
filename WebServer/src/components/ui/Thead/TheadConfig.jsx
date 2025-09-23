import React from 'react'

function TheadConfig() {
    return (
        <thead className="bg-zinc-800/50 border-b border-zinc-700/30">
            <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Dispositivo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Conexión
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Registros
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Última Lectura
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Acciones
                </th>
            </tr>
        </thead>
    )
}

export default TheadConfig