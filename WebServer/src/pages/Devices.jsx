import {useState, useEffect, use} from 'react'

import DeviceTable from '../components/configDevice/DeviceTable';
import StatsCard from '../components/configDevice/StatsCard';
import AddDeviceModal from '../components/configDevice/AddDeviceModal';
import { useGlobalDevice } from '../context/GlobalDevice';

export default function DeviceManagement() {

  const [openModal, setOpenModal] = useState(false);
  const { devices } = useGlobalDevice();

  // useEffect(() => { 

  // }, [device]);


  
  return (
    <div className="p-6 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Device Management</h1>
        <div className="flex gap-3">
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">
            Sincronizar Device
          </button>
          <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg" onClick={() => setOpenModal(true)}>
            + Add Device
          </button>
        </div>
      </div>


      <DeviceTable />

      <div className="grid grid-cols-2 gap-4">
        <StatsCard label="Total Devices" value={devices?.length || 0} color="text-green-400" />
        <StatsCard label="Connected" value={devices?.filter(d => d.status === "Connected").length || 0} color="text-green-400" />
        {/* <StatsCard label="Total Registers" value={0} color="text-yellow-400" /> */}
      </div>
      <AddDeviceModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
