
import React, { useState } from 'react';
import { Hash, Database, Settings2, Plus, Edit, Trash } from 'lucide-react';
import AddModbusRegisterModal from './AddModbusRegisterModal.jsx';
import ModbusRegisterRow from './ModbusRegisterRow.jsx';
import ModbusTableHeader from './ModbusTableHeader.jsx';
import EmptyState from './EmptyState.jsx';

export default function ModbusInfoTable({ 
  infoModbus = [], 
  deviceId, 
  device, // Agregar el objeto device completo
  onAddRegister, 
  onEditRegister, 
  onDeleteRegister 
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRegister, setEditingRegister] = useState(null);

    // Función específica para este dispositivo
    const handleAddRegister = (registerData) => {
        // Validar que el registro es compatible con el dispositivo
        if (device && device.protocol) {
            const deviceSpecificData = {
                ...registerData,
                deviceId: deviceId,
                deviceType: device.deviceType,
                protocol: device.protocol,
                // Metadata específica del dispositivo
                deviceMetadata: {
                    name: device.deviceName,
                    type: device.deviceType,
                    connection: device.protocol === 'TCP' 
                        ? `${device.ipAddress}:${device.port}` 
                        : device.serialPort
                }
            };
            onAddRegister(deviceId, deviceSpecificData);
        } else {
            console.error('Device data incomplete for register creation');
        }
    };

    const handleEditRegister = (registerData) => {
        // Mantener la especificidad del dispositivo en la edición
        const deviceSpecificData = {
            ...registerData,
            deviceId: deviceId,
            lastModified: new Date().toISOString()
        };
        onEditRegister(deviceId, deviceSpecificData);
    };

    const openAddModal = () => {
        setEditingRegister(null);
        setIsModalOpen(true);
    };

    const openEditModal = (register) => {
        setEditingRegister(register);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="px-6 py-4 bg-zinc-900/50 border-t border-zinc-700/30">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-400" />
                        Registros Modbus para {device?.deviceName || 'Dispositivo'} ({infoModbus.length})
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">
                            {device?.protocol} - {device?.deviceType}
                        </span>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-xs font-medium"
                            title={`Agregar registro específico para ${device?.deviceName}`}
                        >
                            <Plus className="w-3 h-3" />
                            Agregar Registro
                        </button>
                    </div>
                </div>

                {infoModbus.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <ModbusTableHeader />
                            <tbody className="divide-y divide-zinc-700/30">
                                {infoModbus.map((register, index) => (
                                    <ModbusRegisterRow
                                        key={register.id || index}
                                        register={register}
                                        index={index}
                                        deviceId={deviceId}
                                        device={device} // Pasar el objeto device completo
                                        onEdit={openEditModal}
                                        onDelete={onDeleteRegister}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AddModbusRegisterModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingRegister(null); // Limpiar el registro en edición
                }}
                deviceId={deviceId}
                device={device} // Pasar el objeto device completo
                editRegister={editingRegister}
            />
        </>
    );
}