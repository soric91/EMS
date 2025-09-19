import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth.js';

/**
 * Hook personalizado para manejar la lógica del layout de la aplicación
 */
export function useAppLayout() {
  const navigate = useNavigate();
  const { logout, userInfo, user } = useAuth();

  const handleLogout = async () => {
    const result = logout();
    if (result.success) {
      navigate('/login');
    }
  };

  return {
    user,
    userInfo,
    handleLogout
  };
}
