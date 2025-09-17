import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth.js';

/**
 * Hook personalizado para proteger rutas
 * Redirige a login si el usuario no está autenticado
 */
export function useRouteProtection() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // No hacer nada mientras se está cargando
    if (isLoading) return;

    // Si no está autenticado y no está en login, redirigir
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { 
        replace: true,
        state: { from: location.pathname }
      });
    }
    
    // Si está autenticado y está en login, redirigir a home
    if (isAuthenticated && location.pathname === '/login') {
      const from = location.state?.from || '/home';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  return {
    isAuthenticated,
    isLoading,
    user,
    canAccess: isAuthenticated && !isLoading
  };
}

/**
 * Hook para manejar redirección después del login
 */
export function useLoginRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterLogin = () => {
    const from = location.state?.from || '/home';
    navigate(from, { replace: true });
  };

  const redirectToLogin = (currentPath = null) => {
    navigate('/login', {
      replace: true,
      state: { from: currentPath || location.pathname }
    });
  };

  return {
    redirectAfterLogin,
    redirectToLogin
  };
}
