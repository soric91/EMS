import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Homepage from './pages/Home';
import { GlobalProvider } from './context/GlobalState.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Settings from './pages/Settings.jsx';

// New modular device management components
import DevicesListPage from './pages/DevicesListPage.jsx';
import DeviceDetailPage from './pages/DeviceDetailPage.jsx';
import DeviceFormPage from './pages/DeviceFormPage.jsx';

// Legacy components (maintained for compatibility)
import Devices from './pages/Devices.jsx';
import Logs from './pages/Logs.jsx';
import AppLayout from './components/Layout/AppLayout.jsx';
import { GlobalDeviceProvider } from  './context/GlobalDevice.jsx';
import EditDeviceModbus from './pages/EditDeviceModbus.jsx';
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

          {/* ===== NEW DEVICE MANAGEMENT ROUTES ===== */}
          
          {/* Main devices list (replaces old /devices) */}
          <Route path="/devices" element={
            <ProtectedRoute>
              <AppLayout><DevicesListPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Device detail view (replaces /edit-device-modbus/:id) */}
          <Route path="/devices/:id" element={
            <ProtectedRoute>
              <AppLayout><DeviceDetailPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Create new device */}
          <Route path="/devices/new" element={
            <ProtectedRoute>
              <AppLayout><DeviceFormPage /></AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Edit existing device */}
          <Route path="/devices/:id/edit" element={
            <ProtectedRoute>
              <AppLayout><DeviceFormPage /></AppLayout>
            </ProtectedRoute>
          } />

          {/* ===== COMPATIBILITY ROUTES (TEMPORARY) ===== */}
          
          {/* Redirect old device editing routes to new structure */}
          <Route path="/edit-device-modbus/:id/:registerId" element={
            <Navigate to="/devices" replace />
          } />
          <Route path="/edit-device-modbus/:id" element={
            <Navigate to="/devices" replace />
          } />
          
          {/* Keep old devices page as backup */}
          <Route path="/devices-old" element={
            <ProtectedRoute>
              <AppLayout><Devices /></AppLayout>
            </ProtectedRoute>
          } />

          {/* ===== OTHER ROUTES ===== */}
          
          <Route path="/logs" element={
            <ProtectedRoute>
              <AppLayout><Logs /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<h1 className="text-center text-3xl min-h-screen flex justify-center items-center">404 - Página no encontrada</h1>} />

        </Routes>
      </Router>
      </GlobalDeviceProvider>
    </GlobalProvider>
  );
};

export default App;
