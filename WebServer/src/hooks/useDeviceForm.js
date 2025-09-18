import { useForm } from "react-hook-form";
import { useState, useEffect} from "react";
import { v4 as uuidv4 } from "uuid";

export default function useDeviceForm(onClose) {
  const { register, handleSubmit, reset , resetField } = useForm();
  const [protocol, setProtocol] = useState("TCP");


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

  const onSubmit = (data) => {
    const deviceconfigparms = {
        id: uuidv4(),
        ...data,
        protocol
    }
    console.log("Datos guardados:", { ...deviceconfigparms, protocol });
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
