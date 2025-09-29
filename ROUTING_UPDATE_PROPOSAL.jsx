// PROPUESTA DE ACTUALIZACIÓN PARA App.jsx
// Este archivo muestra los cambios sugeridos para implementar el nuevo routing

import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Homepage from './pages/Home';
import { GlobalProvider } from './context/GlobalState.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Settings from './pages/Settings.jsx';

// Importaciones actualizadas
import DevicesListPage from './pages/DevicesListPage.jsx';      // Nueva
import DeviceDetailPage from './pages/DeviceDetailPage.jsx';    // Nueva (reemplaza EditDeviceModbus)
import DeviceFormPage from './pages/DeviceFormPage.jsx';        // Nueva
import Logs from './pages/Logs.jsx';
import AppLayout from './components/Layout/AppLayout.jsx';
import { GlobalDeviceProvider } from  './context/GlobalDevice.jsx';

// Mantener para compatibilidad temporal
import EditDeviceModbus from './pages/EditDeviceModbus.jsx';
import Devices from './pages/Devices.jsx';

import ProtectedRoute from './components/Route/ProtectedRoute.jsx';

const App = () => {
  return (
    <GlobalProvider>
      <GlobalDeviceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas con layout */}
          <Route path="/home" element={
            <ProtectedRoute>
              <AppLayout><Homepage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <AppLayout><Settings /></AppLayout>
            </ProtectedRoute>
          } />

          {/* ===== NUEVAS RUTAS DE DISPOSITIVOS ===== */}
          
          {/* Lista principal de dispositivos */}
          <Route path="/devices" element={
            <ProtectedRoute>
              <AppLayout><DevicesListPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Vista detallada de dispositivo específico */}
          <Route path="/devices/:id" element={
            <ProtectedRoute>
              <AppLayout><DeviceDetailPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Crear nuevo dispositivo */}
          <Route path="/devices/new" element={
            <ProtectedRoute>
              <AppLayout><DeviceFormPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Editar dispositivo existente */}
          <Route path="/devices/:id/edit" element={
            <ProtectedRoute>
              <AppLayout><DeviceFormPage /></AppLayout>
            </ProtectedRoute>
          } />

          {/* ===== RUTAS DE COMPATIBILIDAD (TEMPORAL) ===== */
          
          {/* Redirigir ruta antigua a nueva */}
          <Route path="/edit-device-modbus/:id/:registerId?" element={
            <Navigate to="/devices/:id" replace />
          } />
          
          {/* Mantener ruta antigua temporalmente */}
          <Route path="/devices-old" element={
            <ProtectedRoute>
              <AppLayout><Devices /></AppLayout>
            </ProtectedRoute>
          } />

          {/* ===== OTRAS RUTAS ===== */
          
          <Route path="/logs" element={
            <ProtectedRoute>
              <AppLayout><Logs /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={
            <h1 className="text-center text-3xl min-h-screen flex justify-center items-center">
              404 - Página no encontrada
            </h1>
          } />

        </Routes>
      </Router>
      </GlobalDeviceProvider>
    </GlobalProvider>
  );
};

export default App;

/*
PLAN DE MIGRACIÓN GRADUAL:

1. FASE 1: Implementar nuevas rutas en paralelo
   - Mantener rutas antiguas funcionando
   - Agregar nuevas rutas con componentes nuevos
   - Testear funcionalidad completa

2. FASE 2: Actualizar navegación interna
   - Cambiar links internos para usar nuevas rutas
   - Actualizar botones de navegación
   - Mantener compatibilidad con bookmarks

3. FASE 3: Deprecar rutas antiguas
   - Agregar redirects de rutas antiguas a nuevas
   - Mostrar warnings en consola para desarrolladores
   - Documentar cambios

4. FASE 4: Limpieza final
   - Remover componentes antiguos no utilizados
   - Eliminar rutas de compatibilidad
   - Optimizar bundle size

BENEFICIOS:
- URLs más semánticas y RESTful
- Navegación más intuitiva
- Mejor SEO y bookmarking
- Escalabilidad para futuras funcionalidades
- Separación clara de responsabilidades

COMPATIBILIDAD:
- Redirects automáticos desde rutas antiguas
- No breaking changes para usuarios finales
- Migración gradual sin downtime
*/