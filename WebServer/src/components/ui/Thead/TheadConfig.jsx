import React from 'react'

function TheadConfig() {
    return (
        <><thead className="bg-gray-800 text-gray-400 uppercase text-xs">
            <tr>
                <th className="px-4 py-3 text-left">Device Name</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Modbus ID</th>
                <th className="px-4 py-3 text-left">IP Address/Port Serial</th>
                <th className="px-4 py-3 text-left">Registers</th>
                <th className="px-4 py-3 text-left">Last Read</th>
                <th className="px-4 py-3 text-left">Actions</th>
            </tr>
        </thead></>
    )
}

export default TheadConfig