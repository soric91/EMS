import { useGlobalState } from "../../context/GlobalContext";

/**
 * Hook personalizado para manejar la autenticación
 * Proporciona una interfaz limpia para las operaciones de auth
 */
export const useAuth = () => {
  const { user, loginUser, error, clearError, isLoading } = useGlobalState();
  
  const login = async (credentials) => {
    clearError();
    try {
      const result = await loginUser(credentials);
      return result;
    } catch (err) {
      console.error("Error en login:", err);
      throw err;
    }
  };

  const logout = () => {
    // TODO: Implementar logout cuando sea necesario
    clearError();
  };

  return {
    // Estado
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    
    // Acciones
    login,
    logout,
    clearError
  };
};
