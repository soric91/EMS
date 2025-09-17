import { useAuth } from './useAuth.js';
import { useSidebar } from './useSidebar.js';

/**
 * Hook personalizado para manejar la lógica del TopBar
 * Centraliza la lógica de autenticación y sidebar en el header
 */
export const useTopBar = () => {
    const { user, logout } = useAuth();
    const { toggleSidebar } = useSidebar();

    // Función para manejar el toggle del menú
    const handleMenuToggle = () => {
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
    const userAvatar = user?.avatar || null;

    return {
        // Datos del usuario
        user,
        userDisplayName,
        userAvatar,
        
        // Funciones de acción
        handleMenuToggle,
        handleLogout,
        
        // Estado de autenticación
        isAuthenticated: !!user
    };
};
