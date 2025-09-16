import { FaCogs, FaChartLine } from "react-icons/fa";
import {FcElectroDevices} from "react-icons/fc";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleClick = (section) => {
    navigate(`/${section}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
  <Card title="Dashboard" icon={<FaChartLine />} onClick={() => handleClick("dashboard")}>
        Visualiza métricas de energía en tiempo real.
      </Card>


  <Card title="Devices" icon={<FcElectroDevices />} onClick={() => handleClick("devices")}>
        Administra el flujo de energía y acciones del sistema.
      </Card>
  <Card title="Config. equipos" icon={<FaCogs />} onClick={() => handleClick("config-devices")}>
        Ajusta parámetros del sistema y dispositivos conectados.
      </Card>
    </div>
  );
}

export default Dashboard;