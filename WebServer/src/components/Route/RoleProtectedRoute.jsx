import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth.js';

/**
 * Componente para proteger rutas con roles específicos
 * Permite definir roles requeridos para acceder a una ruta
 */
const RoleProtectedRoute = ({ children, allowedRoles = [], requireAdmin = false }) => {
  const { isAuthenticated, isLoading, userInfo } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Verificar si es admin (si se requiere)
  if (requireAdmin && userInfo?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página.</p>
          <p className="text-sm text-gray-500">Se requieren permisos de administrador.</p>
        </div>
      </div>
    );
  }

  // Verificar roles específicos
  if (allowedRoles.length > 0 && userInfo?.is_admin && !allowedRoles.includes(userInfo.is_admin)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página.</p>
          <p className="text-sm text-gray-500">
            Roles requeridos: {allowedRoles.join(', ')}
          </p>
        </div>
      </div>
    );
  }

  // Si tiene permisos, mostrar el contenido
  return children;
};

export default RoleProtectedRoute;