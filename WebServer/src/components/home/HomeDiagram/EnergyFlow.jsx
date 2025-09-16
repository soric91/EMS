import { motion } from "framer-motion";
import { Bolt } from "lucide-react";
import { useEffect, useState } from "react";

const EnergyFlow = ({
  fromColor,
  toColor,
  delay = 0,
  measures = { w: 'w-40', h: 'h-1', wMobile: 'w-1', hMobile: 'h-20' },
  enterDelay = 0,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768); // md breakpoint
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const hMobile = measures.hMobile ?? measures.h;
  const wMobile = measures.wMobile ?? measures.w;
  const h = measures.h ?? 'h-1';
  const w = measures.w ?? 'w-40';

  return (
    <motion.div
      className={`
        relative rounded-full overflow-hidden
        ${isMobile ? `${hMobile} ${wMobile} bg-gradient-to-b` : `${h} ${w} bg-gradient-to-r`}
        ${fromColor} ${toColor}
      `}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: enterDelay }}
    >
      {isMobile ? (
        /* Animación vertical en móvil */
        <motion.div
          animate={{ y: ["-150%", "150%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear", delay }}
          className="absolute left-[-10px] top-0"
        >
          <Bolt className="w-5 h-5 text-yellow-400 drop-shadow-md" />
        </motion.div>
      ) : (
        /* Animación horizontal en desktop */
        <motion.div
          animate={{ x: ["-150%", "150%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear", delay }}
          className="absolute top-[-12px] left-0"
        >
          <Bolt className="w-5 h-5 text-yellow-400 drop-shadow-md" />
        </motion.div>
      )}
  </motion.div>
  );
};

export default EnergyFlow;

