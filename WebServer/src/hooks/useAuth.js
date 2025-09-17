import { useGlobalState } from '../context/GlobalState.jsx';

/**
 * Hook personalizado para manejar la autenticación del usuario
 * Proporciona funciones y estado relacionados con la autenticación
 */
export function useAuth() {
  const { user, error, isLoading, loginUser, logOutUser, isAuthenticated } = useGlobalState();

  const login = async (credentials) => {
    try {
      const result = await loginUser(credentials);
      return result;
    } catch (error) {
      console.error('Error en login hook:', error);
      return { success: false, error: error.message || 'Error desconocido' };
    }
  };

  const logout = () => {
    try {
      logOutUser();
      return { success: true };
    } catch (error) {
      console.error('Error en logout hook:', error);
      return { success: false, error: error.message || 'Error al cerrar sesión' };
    }
  };

  const getUserInfo = () => {
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.username || user.name || 'Usuario',
      email: user.email || 'sin-email@example.com',
      username: user.username,
      ...user
    };
  };

  return {
    // Estado
    user,
    userInfo: getUserInfo(),
    isAuthenticated,
    isLoading,
    error,
    
    // Funciones
    login,
    logout,
    
    // Utilidades
    hasUser: !!user,
    isGuest: !user,
  };
}
