// import Header from "../components/Header/Header.jsx";
// import { useGlobalState } from "../context/GlobalState.jsx";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { motion } from "framer-motion";
// import { Bolt, Home, Gauge, Server, Monitor } from "lucide-react";
// import EnergyFlow from "../components/home/HomeDiagram/EnergyFlow.jsx";
// import MenuCards from "../components/home/MenuCards.jsx";

// const Homepage = () => {
//   const { user, isAuthenticated } = useGlobalState();
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   if (!user && !isAuthenticated) {
//   //     navigate("/login");
//   //   }
//   // }, [isAuthenticated, user, navigate]);

//   // if (!user && !isAuthenticated) {
//   //   return (
//   //     <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
//   //       <div className="text-zinc-100">Verificando autenticación...</div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
//       <Header />

//       {/* Contenedor principal con altura calculada */}
//       <div className="flex-1 flex flex-col items-center justify-center px-4 py-2">

//         {/* Diagrama de flujo energético - optimizado */}
//         <div className="flex flex-wrap items-center justify-center gap-3 mb-8">

//           {/* Flujo horizontal principal */}
//           <div className="flex items-center gap-3 flex-wrap justify-center">
//             {/* Red Comercial Eléctrica */}
//             <div className="flex flex-col items-center">
//               <Bolt className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
//               <span className="mt-1 text-xs text-center">Red Comercial<br />Eléctrica</span>
//             </div>

//             <EnergyFlow
//               fromColor="from-purple-400"
//               toColor="to-indigo-500"
//               delay={0}
//               measures={{ h: "h-0.5", w: "w-8 md:w-10" }}
//             />

//             {/* Medidor CFE */}
//             <div className="flex flex-col items-center">
//               <Gauge className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
//               <span className="mt-1 text-xs text-center">Medidor CFE</span>
//             </div>

//             <EnergyFlow
//               fromColor="from-purple-500"
//               toColor="to-fuchsia-400"
//               delay={0.5}
//               measures={{ h: "h-0.5", w: "w-8 md:w-12" }}
//             />

//             {/* Casa Usuario */}
//             <div className="flex flex-col items-center">
//               <Home className="w-8 h-8 md:w-10 md:h-10 text-fuchsia-400" />
//               <span className="mt-1 text-xs text-center">Casa Usuario</span>
//             </div>

//             <EnergyFlow
//               fromColor="from-purple-400"
//               toColor="to-indigo-500"
//               delay={1}
//               measures={{ h: "h-0.5", w: "w-12 md:w-16" }}
//             />

//             {/* EMS optimizado */}
//             <div className="flex flex-col items-center relative p-4">
//               {/* Bordes del recuadro incompleto */}
//               <div className="absolute top-0 left-0 w-5 h-5 md:w-6 md:h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg"></div>
//               <div className="absolute top-0 right-0 w-5 h-5 md:w-6 md:h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg"></div>
//               <div className="absolute bottom-0 left-0 w-5 h-5 md:w-6 md:h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg"></div>
//               <div className="absolute bottom-0 right-0 w-5 h-5 md:w-6 md:h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-lg"></div>

//               {/* Título EMS */}
//               <span className="absolute -top-6 md:-top-7 text-sm md:text-base font-bold text-cyan-300">EMS</span>

//               {/* Contenido del EMS - Layout responsivo */}
//               <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
//                 <div className="flex flex-col items-center">
//                   <Gauge className="w-6 h-6 md:w-8 md:h-8 text-pink-400" />
//                   <span className="mt-1 text-xs">Medidor EMS</span>
//                 </div>
//                 <EnergyFlow
//                   fromColor="from-purple-400"
//                   toColor="to-indigo-500"
//                   delay={0}
//                   measures={{ h: "h-0.5", w: "w-8 md:w-5" }}
//                 />
//                 <div className="flex flex-col items-center">
//                   <Server className="w-6 h-6 md:w-8 md:h-8 text-pink-400" />
//                   <span className="mt-1 text-xs">Gateway</span>
//                 </div>
//                 <EnergyFlow
//                   fromColor="from-purple-400"
//                   toColor="to-indigo-500"
//                   delay={0}
//                   measures={{ h: "h-0.5", w: "w-8 md:w-5" }}
//                 />
//                 <div className="flex flex-col items-center">
//                   <Monitor className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
//                   <span className="mt-1 text-xs">Panel Control</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tarjetas de menú - espacio optimizado */}
//         <div className="w-full max-w-4xl mb-6">
//           <MenuCards />
//         </div>

//         {/* Descripción compacta */}
//         <p className="max-w-3xl text-center text-gray-400 text-xs md:text-sm leading-relaxed px-4">
//           Sistema completo de monitoreo energético: desde la red eléctrica y el medidor oficial hasta el análisis paralelo del EMS, con gateway y panel de control.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Homepage;

import { useGlobalState } from "../context/GlobalState.jsx";
import { useNavigate } from "react-router-dom";
import EnergyDiagram from "../components/home/HomeDiagram/EnergyDiagram.jsx";
import MenuCards from "../components/home/MenuCards.jsx";
import SystemDescription from "../components/home/SystemDescription.jsx";
import { useEffect } from "react";


const Homepage = () => {
  const { user, isAuthenticated } = useGlobalState();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user && !isAuthenticated) {
  //     navigate("/login");  
  //   }
  // }, [isAuthenticated, user, navigate]);

  // if (!user && !isAuthenticated) {
  //   return (
  //     <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
  //       <div className="text-zinc-100">Verificando autenticación...</div>
  //     </div>
  //   );
  // }

  return (
  <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
    <main className="flex-1 flex flex-col items-center px-4 py-4 sm:px-6 lg:px-8 gap-6 overflow-y-auto">
        {/* Diagrama (responsive) */}
        <section className="w-full max-w-5xl mt-10 md:mt-16">  {/* ← agregado margen superior */}
          <EnergyDiagram />
        </section>

        {/* Tarjetas (grid responsive) */}
        <section className="w-full max-w-5xl">
          <MenuCards />
        </section>

        {/* Descripción (texto adaptable) */}
        <section className="w-full max-w-4xl">
          <SystemDescription />
        </section>
      </main>

    </div>
  );
};

export default Homepage;