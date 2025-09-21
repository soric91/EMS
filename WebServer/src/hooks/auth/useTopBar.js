import { useAuth } from './useAuth.js';
import { useSidebar } from '../../context/SidebarContext.jsx';

/**
 * Hook personalizado para manejar la lógica del TopBar
 * Centraliza la lógica de autenticación y sidebar en el header
 */
export const useTopBar = () => {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar();

    // Función para manejar el toggle del menú
    const handleMenuToggle = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        toggleSidebar();
    };

    // Función para manejar el logout
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Obtener información del usuario para mostrar
    const userDisplayName = user?.username || user?.email || 'Usuario';


    return {
        // Datos del usuario
        user,
        userDisplayName,
        
        // Funciones de acción
        handleMenuToggle,
        handleLogout,
        
        // Estado de autenticación
        isAuthenticated: !!user
    };
};
