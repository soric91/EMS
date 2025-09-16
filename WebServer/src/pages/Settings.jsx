import { useGlobalState } from '../context/GlobalState.jsx';
import { Navigate } from 'react-router-dom';

export default function Settings() {
  const { user } = useGlobalState();

  // Validación adicional por si alguien accede por URL
  if (!user?.is_admin) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div>
      <h1>Configuración del Sistema</h1>
      {/* Contenido solo para admins */}
    </div>
  );
}