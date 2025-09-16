import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalState.jsx';

/**
 * Hook personalizado para manejar la lógica de autenticación en el layout
 */
export function useAppLayout() {
  const navigate = useNavigate();
  const { user, logOutUser } = useGlobalState();

  const handleLogout = () => {
    logOutUser();
    navigate('/login');
  };

  const getUserInfo = () => ({
    name: user?.username || user?.name || 'Admin',
    email: user?.email || 'admin@example.com'
  });

  return {
    user,
    userInfo: getUserInfo(),
    handleLogout
  };
}
