const SystemDescription = ({ 
  className = "",
  text = "Sistema completo de monitoreo energético: desde la red eléctrica y el medidor oficial hasta el análisis paralelo del EMS, con gateway y panel de control."
}) => {
  return (
    <footer className={`max-w-3xl text-center text-gray-400 text-xs md:text-sm leading-relaxed px-4 ${className}`}>
      <p>{text}</p>
    </footer>
  );
};

export default SystemDescription;