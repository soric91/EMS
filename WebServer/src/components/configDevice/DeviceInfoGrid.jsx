import { 
  Cpu, Package, Network, Hash, Globe, Plug, Usb, Gauge, 
  Binary, ListOrdered, CalendarClock, FileText, CheckCircle, 
  CornerDownRight, PlayCircle 
} from "lucide-react";

// Componente para cada card individual de información
const InfoCard = ({ icon: Icon, label, value, colorClass = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500/20 border-blue-500/30 group-hover:bg-blue-500/30 text-blue-400",
    green: "bg-green-500/20 border-green-500/30 group-hover:bg-green-500/30 text-green-400",
    purple: "bg-purple-500/20 border-purple-500/30 group-hover:bg-purple-500/30 text-purple-400",
    orange: "bg-orange-500/20 border-orange-500/30 group-hover:bg-orange-500/30 text-orange-400",
    cyan: "bg-cyan-500/20 border-cyan-500/30 group-hover:bg-cyan-500/30 text-cyan-400",
    pink: "bg-pink-500/20 border-pink-500/30 group-hover:bg-pink-500/30 text-pink-400",
    yellow: "bg-yellow-500/20 border-yellow-500/30 group-hover:bg-yellow-500/30 text-yellow-400",
    emerald: "bg-emerald-500/20 border-emerald-500/30 group-hover:bg-emerald-500/30 text-emerald-400",
    indigo: "bg-indigo-500/20 border-indigo-500/30 group-hover:bg-indigo-500/30 text-indigo-400",
    teal: "bg-teal-500/20 border-teal-500/30 group-hover:bg-teal-500/30 text-teal-400",
    red: "bg-red-500/20 border-red-500/30 group-hover:bg-red-500/30 text-red-400",
    violet: "bg-violet-500/20 border-violet-500/30 group-hover:bg-violet-500/30 text-violet-400",
    amber: "bg-amber-500/20 border-amber-500/30 group-hover:bg-amber-500/30 text-amber-400",
    slate: "bg-slate-500/20 border-slate-500/30 group-hover:bg-slate-500/30 text-slate-400"
  };

  return (
    <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-4 rounded-xl border border-gray-600/30 backdrop-blur-sm hover:border-gray-500/50 transition-all duration-200 group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg border transition-colors ${colorClasses[colorClass]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1 font-medium">{label}</label>
          <p className="text-white font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Componente para la sección de descripción
const DescriptionSection = ({ description }) => {
  if (!description) return null;

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600/30 backdrop-blur-sm flex items-start gap-3">
      <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 mt-0.5">
        <FileText className="text-purple-400 w-4 h-4" />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-2 font-semibold uppercase tracking-wider">
          Description
        </label>
        <p className="text-white text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

// Sección de información básica - siempre 3 columnas
const BasicInfoSection = ({ device }) => {
  const basicFields = [
    { icon: Cpu, label: "Device Name", value: device.deviceName, color: "blue" },
    { icon: Package, label: "Device Type", value: device.deviceType, color: "green" },
    { icon: Network, label: "Protocol", value: device.protocol, color: "purple" },
    { icon: Hash, label: "Modbus ID", value: device.modbusId, color: "orange" },
    { icon: PlayCircle, label: "Start Address", value: device.startAddress, color: "violet" },
    { icon: ListOrdered, label: "Number of Registers", value: device.registers, color: "amber" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {basicFields.map((field, index) => (
        <InfoCard
          key={index}
          icon={field.icon}
          label={field.label}
          value={field.value}
          colorClass={field.color}
        />
      ))}
    </div>
  );
};

// Sección específica para protocolo TCP - completa el grid a 3x3 (9 elementos)
const TCPSection = ({ device }) => {
  if (device.protocol !== 'TCP') return null;

  const tcpFields = [
    { icon: Globe, label: "IP Address", value: device.ipAddress || device.ip, color: "cyan" },
    { icon: Plug, label: "Port", value: device.port, color: "pink" }
  ];

  // Agregar fecha de creación si existe para completar la fila
  if (device.createdAt) {
    tcpFields.push({
      icon: CalendarClock,
      label: "Created",
      value: new Date(device.createdAt).toLocaleString(),
      color: "slate"
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {tcpFields.map((field, index) => (
        <InfoCard
          key={index}
          icon={field.icon}
          label={field.label}
          value={field.value}
          colorClass={field.color}
        />
      ))}
    </div>
  );
};

// Sección específica para protocolo RTU - completa a 3x4 (12 elementos)
const RTUSection = ({ device }) => {
  if (device.protocol !== 'RTU') return null;

  const rtuFields = [
    { icon: Usb, label: "Serial Port", value: device.serialPort, color: "yellow" },
    { icon: Gauge, label: "Baud Rate", value: device.baudRate, color: "emerald" },
    { icon: Binary, label: "Data Bits", value: device.dataBits, color: "indigo" },
    { icon: CheckCircle, label: "Parity", value: device.parity, color: "teal" },
    { icon: CornerDownRight, label: "Stop Bits", value: device.stopBits, color: "red" }
  ];

  // Agregar fecha de creación si existe para completar la última fila
  if (device.createdAt) {
    rtuFields.push({
      icon: CalendarClock,
      label: "Created",
      value: new Date(device.createdAt).toLocaleString(),
      color: "slate"
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {rtuFields.map((field, index) => (
        <InfoCard
          key={index}
          icon={field.icon}
          label={field.label}
          value={field.value}
          colorClass={field.color}
        />
      ))}
    </div>
  );
};

// Componente principal reorganizado - sin sección adicional 
export default function DeviceInfoGrid({ device }) {
  return (
    <>
      <DescriptionSection description={device.description} />
      <BasicInfoSection device={device} />
      <TCPSection device={device} />
      <RTUSection device={device} />
    </>
  );
}