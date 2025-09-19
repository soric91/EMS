import { useState } from 'react';

export function useModalState() {
  const [isAddRegisterModalOpen, setIsAddRegisterModalOpen] = useState(false);
  const [isEditDeviceModalOpen, setIsEditDeviceModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [registerToDelete, setRegisterToDelete] = useState(null);

  const openAddRegisterModal = () => {
    setIsAddRegisterModalOpen(true);
  };

  const closeAddRegisterModal = () => {
    setIsAddRegisterModalOpen(false);
  };

  const openEditDeviceModal = () => {
    setIsEditDeviceModalOpen(true);
  };

  const closeEditDeviceModal = () => {
    setIsEditDeviceModalOpen(false);
  };

  const openDeleteModal = (registerId, register) => {
    setRegisterToDelete({ id: registerId, register });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRegisterToDelete(null);
  };

  return {
    // States
    isAddRegisterModalOpen,
    isEditDeviceModalOpen,
    isDeleteModalOpen,
    registerToDelete,
    
    // Actions
    openAddRegisterModal,
    closeAddRegisterModal,
    openEditDeviceModal,
    closeEditDeviceModal,
    openDeleteModal,
    closeDeleteModal
  };
}