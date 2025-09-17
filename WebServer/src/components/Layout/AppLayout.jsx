import TopBar from '../ui/TopBar.jsx';
import SidebarContainer from './SidebarContainer.jsx';
import MainContent from './MainContent.jsx';
import AppFooter from './AppFooter.jsx';

/**
 * Layout principal de la aplicación
 * Gestiona la estructura general: sidebar, topbar, contenido y footer
 * Cada componente maneja su propia lógica a través de hooks
 */
export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar Container */}
      <SidebarContainer />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar />

        {/* Main Content */}
        <MainContent>
          {children}
        </MainContent>

        {/* Footer */}
        <AppFooter />
      </div>
    </div>
  );
}
