import { useForm } from "react-hook-form";
import { useState, useEffect} from "react";
import { v4 as uuidv4 } from "uuid";
import { useGlobalDevice } from "../../context/GlobalDevice";

export default function useDeviceForm(onClose) {
  const { register, handleSubmit, reset, resetField, formState, setValue } = useForm({
    mode: 'onChange', // Enable validation on change
    defaultValues: {
      deviceName: '',
      deviceType: '',
      description: '',
      protocol: 'TCP',
      ipAddress: '',
      port: 502,
      serialPort: '',
      baudRate: '9600',
      dataBits: '8',
      parity: 'N',
      stopBits: '1',
      modbusId: 1,
      startAddress: 0,
      registers: 10
    }
  });
  const [protocol, setProtocol] = useState("TCP");
  const {addDevice } = useGlobalDevice();



  // Improved protocol switching
  const handleProtocolChange = (newProtocol) => {
    setProtocol(newProtocol);
    setValue('protocol', newProtocol);
    
    // Clear fields based on protocol
    if (newProtocol === "TCP") {
      setValue('serialPort', '');
      setValue('baudRate', '9600');
      setValue('dataBits', '8');
      setValue('parity', 'N');
      setValue('stopBits', '1');
      setValue('port', 502);
    } else if (newProtocol === "RTU") {
      setValue('ipAddress', '');
      setValue('port', 502);
    }
  };

  useEffect(() => {
    handleProtocolChange(protocol);
  }, []); // Run once on mount

  const onSubmit = async (data) => {
    const deviceconfigparms = {
        id: uuidv4(),
        ...data,
        protocol
    }
    const result = await addDevice(deviceconfigparms);
    console.log("Datos guardados:", result);
    if (onClose) onClose();  // cerrar modal
    resetForm();             // limpiar form
  };

  const resetForm = () => {
    reset();
    setProtocol('TCP');
  };

  return {
    register,
    handleSubmit,
    reset,
    resetForm,
    protocol,
    setProtocol: handleProtocolChange, // Use the improved handler
    onSubmit,
    formState, // Add formState to the return object
    setValue, // Export setValue for external use if needed
  };
}
