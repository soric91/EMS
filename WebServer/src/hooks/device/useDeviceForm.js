import { useForm } from "react-hook-form";
import { useState, useEffect} from "react";
import { v4 as uuidv4 } from "uuid";
import { useGlobalDevice } from "../../context/GlobalDevice";

export default function useDeviceForm(onClose) {
  const { register, handleSubmit, reset , resetField } = useForm();
  const [protocol, setProtocol] = useState("TCP");
  const {addDevice } = useGlobalDevice();



   useEffect(() => {
    if (protocol === "TCP") {
      resetField("serialPort");
      resetField("baudRate");
      resetField("dataBits");
      resetField("parity");
      resetField("stopBits");
    } else if (protocol === "RTU") {
      resetField("ipAddress");
      resetField("port");
    }
  }, [protocol, resetField]);

  const onSubmit = async (data) => {
    const deviceconfigparms = {
        id: uuidv4(),
        ...data,
        protocol
    }
    const result = await addDevice(deviceconfigparms);
    console.log("Datos guardados:", result);
    if (onClose) onClose();  // cerrar modal
    reset();                 // limpiar form
  };

  return {
    register,
    handleSubmit,
    reset,
    protocol,
    setProtocol,
    onSubmit,
  };
}
