import { useState } from "react";
import { useGlobalDevice } from "../../context/GlobalDevice";

export function useDeleteDeviceModal() {
  const { deleteDevice } = useGlobalDevice();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const openModal = (device) => {
    setSelectedDevice(device);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDevice(null);
  };

  const confirmDelete = async () => {
    if (selectedDevice) {
      await deleteDevice(selectedDevice.id);
      closeModal(); // cerrar automáticamente tras borrar
    }
  };

  return {
    isModalOpen,
    selectedDevice,
    openModal,
    closeModal,
    confirmDelete,
  };
}
