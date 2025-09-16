import { Bolt, Home, Gauge } from 'lucide-react';
import DeviceIcon from './DeviceIcon.jsx';
import EMSContainer from './EMSContainer.jsx';
import EnergyFlow from './EnergyFlow.jsx';

const EnergyDiagram = () => {
  const energyFlowConfig = {
    commercial: {
      fromColor: "from-purple-400",
      toColor: "to-indigo-500",
      delay: 0,
      measures: { h: "h-0.5", w: "w-8 md:w-10", hMobile: "h-1", wMobile: "w-5" }
    },
    cfe: {
      fromColor: "from-purple-500",
      toColor: "to-fuchsia-400",
      delay: 0.5,
      measures: { h: "h-0.5", w: "w-8 md:w-12", hMobile: "h-1", wMobile: "w-5" }
    },
    house: {
      fromColor: "from-fuchsia-400",
      toColor: "to-cyan-500",
      delay: 1,
      measures: { h: "h-0.5", w: "w-12 md:w-16", hMobile: "h-1", wMobile: "w-5" }
    }
  };

  return (
    <section className="flex flex-wrap items-center justify-center gap-3 mb-8">
      <div className="flex items-center gap-3 flex-wrap justify-center">
        
        {/* Red Comercial Eléctrica */}
        <DeviceIcon
          icon={Bolt}
          label="Red Comercial"
          iconColor="text-cyan-400"
          delay={0.05}
        />

        <EnergyFlow {...energyFlowConfig.commercial} enterDelay={0.1} />

        {/* Medidor CFE */}
        <DeviceIcon
          icon={Gauge}
          label="Medidor"
          iconColor="text-purple-400"
          delay={0.15}
        />

        <EnergyFlow {...energyFlowConfig.cfe} enterDelay={0.2} />

        {/* Casa Usuario */}
        <DeviceIcon
          icon={Home}
          label="Casa"
          iconColor="text-fuchsia-400"
          delay={0.25}
        />

        <EnergyFlow {...energyFlowConfig.house} enterDelay={0.3} />

        {/* Sistema EMS */}
        <EMSContainer />
        
      </div>
    </section>
  );
};

export default EnergyDiagram;