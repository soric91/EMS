import { useEffect } from 'react';
import TopBar from '../ui/TopBar.jsx';
import SidebarContainer from './SidebarContainer.jsx';
import MainContent from './MainContent.jsx';
import AppFooter from './AppFooter.jsx';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext.jsx';

/**
 * Layout content component that uses sidebar context
 */
function AppLayoutContent({ children }) {
  const { isOpen, isMobile } = useSidebar();

  // Add body classes to prevent scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 flex relative">
      {/* Sidebar Container */}
      <SidebarContainer />

      {/* Main Content Area */}
      <div 
        className={`
          flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out
          ${isOpen && !isMobile ? 'md:ml-0' : 'ml-0'}
        `}
      >
        {/* Top Bar */}
        <TopBar />

        {/* Main Content */}
        <MainContent>
          {children}
        </MainContent>

        {/* Footer */}
        <AppFooter />
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/3 rounded-full blur-3xl" />
      </div>
    </div>
  );
}

/**
 * Layout principal de la aplicación
 * Gestiona la estructura general: sidebar, topbar, contenido y footer
 * Cada componente maneja su propia lógica a través de hooks
 */
export default function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>
        {children}
      </AppLayoutContent>
    </SidebarProvider>
  );
}
