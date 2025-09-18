import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Homepage from './pages/Home';
import { GlobalProvider } from './context/GlobalState.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Settings from './pages/Settings.jsx';
import DeviceManagement from './pages/ConfigDevices.jsx';
import DeviceConfig from './pages/DeviceConfig.jsx';
import Devices from './pages/Devices.jsx';
import Logs from './pages/Logs.jsx';
import AppLayout from './components/Layout/AppLayout.jsx';
import EditDeviceModbus from './pages/EditDeviceModbus.jsx';


const App = () => {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas con layout */}
          <Route path="/home" element={<AppLayout><Homepage /></AppLayout>} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
          <Route path="/config-devices" element={<AppLayout><DeviceManagement /></AppLayout>} />
          <Route path="/device-config/:deviceId" element={<AppLayout><DeviceConfig /></AppLayout>} />
          <Route path="/devices" element={<AppLayout><Devices /></AppLayout>} />
          <Route path="/edit-device-modbus/:id" element={<AppLayout><EditDeviceModbus /></AppLayout>} />
          <Route path="/logs" element={<AppLayout><Logs /></AppLayout>} />

          <Route path="*" element={<h1 className="text-center text-3xl min-h-screen flex justify-center items-center">404 - Página no encontrada</h1>} />

        </Routes>
      </Router>
    </GlobalProvider>
  );
};

export default App;
