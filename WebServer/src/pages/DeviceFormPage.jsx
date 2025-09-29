import { useParams, useNavigate } from 'react-router-dom';
import DeviceFormUnified from '../components/configDevice/DeviceFormUnified';
import { useGlobalDevice } from '../context/GlobalDevice';

/**
 * Página dedicada para crear/editar dispositivos
 * Usa el componente unificado en modo página completa
 */
export default function DeviceFormPage() {
  const { id } = useParams(); // Si existe id, estamos editando
  const navigate = useNavigate();
  const { getDeviceById } = useGlobalDevice();
  
  const device = id ? getDeviceById(id) : null;
  const isEditing = !!device;

  const handleSave = () => {
    // Después de guardar exitosamente
    if (isEditing) {
      navigate(`/devices/${id}`);
    } else {
      navigate('/devices');
    }
  };

  const handleCancel = () => {
    // Cancelar y volver
    if (isEditing) {
      navigate(`/devices/${id}`);
    } else {
      navigate('/devices');
    }
  };

  // Breadcrumbs
  const renderBreadcrumbs = () => (
    <nav className="flex items-center space-x-2 text-sm text-zinc-400 mb-6">
      <button
        onClick={() => navigate('/devices')}
        className="hover:text-white transition-colors"
      >
        Dispositivos
      </button>
      <span>/</span>
      {isEditing ? (
        <>
          <button
            onClick={() => navigate(`/devices/${id}`)}
            className="hover:text-white transition-colors"
          >
            {device.deviceName}
          </button>
          <span>/</span>
          <span className="text-blue-400">Editar</span>
        </>
      ) : (
        <span className="text-green-400">Nuevo Dispositivo</span>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6">
      <div className="container mx-auto px-6 max-w-6xl">
        {renderBreadcrumbs()}
        
        <DeviceFormUnified
          mode="page"
          device={device}
          onSave={handleSave}
          onClose={handleCancel}
        />
      </div>
    </div>
  );
}