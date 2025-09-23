import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Homepage from './pages/Home';
import { GlobalProvider } from './context/GlobalState.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Settings from './pages/Settings.jsx';

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

          <Route path="/edit-device-modbus/:id/:registerId" element={
            <ProtectedRoute>
              <AppLayout><EditDeviceModbus /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/devices" element={
            <ProtectedRoute>
              <AppLayout><Devices /></AppLayout>
            </ProtectedRoute>
          } />
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
