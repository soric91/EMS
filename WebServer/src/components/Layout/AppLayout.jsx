import TopBar from '../ui/TopBar.jsx';
import SidebarContainer from './SidebarContainer.jsx';
import MainContent from './MainContent.jsx';
import AppFooter from './AppFooter.jsx';
import { useAppLayout } from '../../hooks/useAppLayout.js';
import { useSidebar } from '../../hooks/useSidebar.js';

/**
 * Layout principal de la aplicación
 * Gestiona la estructura general: sidebar, topbar, contenido y footer
 */
export default function AppLayout({ children }) {
  const { userInfo, handleLogout } = useAppLayout();
  const { isOpen, toggle } = useSidebar();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar Container */}
      <SidebarContainer isOpen={isOpen} onToggle={toggle} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar
          open={isOpen}
          onToggleMenu={toggle}
          userName={userInfo.name}
          email={userInfo.email}
          onLogout={handleLogout}
        />

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
