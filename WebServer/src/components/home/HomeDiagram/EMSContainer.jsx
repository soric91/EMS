import { Gauge, Server, Monitor } from 'lucide-react';
import DeviceIcon from './DeviceIcon.jsx';
import EnergyFlow from './EnergyFlow.jsx';

const EMSContainer = () => {
  const CornerBorder = ({ position }) => {
    const positionClasses = {
      'top-left': 'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
      'top-right': 'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
      'bottom-left': 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
      'bottom-right': 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg'
    };

    return (
      <div 
        className={`absolute w-5 h-5 md:w-6 md:h-6 border-cyan-400 ${positionClasses[position]}`}
      />
    );
  };

  return (
    <div className="flex flex-col items-center relative p-4">
      {/* Bordes decorativos */}
      <CornerBorder position="top-left" />
      <CornerBorder position="top-right" />
      <CornerBorder position="bottom-left" />
      <CornerBorder position="bottom-right" />

      {/* Título EMS */}
      <span className="absolute -top-6 md:-top-7 text-sm md:text-base font-bold text-cyan-300">
        EMS
      </span>

      {/* Dispositivos del EMS */}
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
        <DeviceIcon
          icon={Gauge}
          label="Medidor EMS"
          iconColor="text-pink-400"
          size="sm"
          delay={0.35}
        />
        
        <div className="hidden md:block">
          <EnergyFlow
            fromColor="from-pink-400"
            toColor="to-pink-500"
            delay={0}
            measures={{ h: "h-0.5", w: "w-5" }}
            enterDelay={0.4}
          />
        </div>
        
        <DeviceIcon
          icon={Server}
          label="Gateway"
          iconColor="text-pink-400"
          size="sm"
          delay={0.45}
        />
        
        <div className="hidden md:block">
          <EnergyFlow
            fromColor="from-pink-500"
            toColor="to-cyan-400"
            delay={0.5}
            measures={{ h: "h-0.5", w: "w-5" }}
            enterDelay={0.5}
          />
        </div>
        
        <DeviceIcon
          icon={Monitor}
          label="Panel Control"
          iconColor="text-cyan-400"
          size="sm"
          delay={0.55}
        />
      </div>
    </div>
  );
};

export default EMSContainer;