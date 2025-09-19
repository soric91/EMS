// Ejemplo de uso de protección de rutas con roles
// Este archivo muestra diferentes formas de proteger rutas

import ProtectedRoute from './components/Route/ProtectedRoute.jsx';
import RoleProtectedRoute from './components/Route/RoleProtectedRoute.jsx';

// EJEMPLO 1: Protección básica (solo requiere estar logueado)
/*
<Route path="/home" element={
  <ProtectedRoute>
    <AppLayout><Homepage /></AppLayout>
  </ProtectedRoute>
} />
*/

// EJEMPLO 2: Protección con roles específicos
/*
<Route path="/admin" element={
  <RoleProtectedRoute allowedRoles={['admin', 'superuser']}>
    <AppLayout><AdminPanel /></AppLayout>
  </RoleProtectedRoute>
} />
*/

// EJEMPLO 3: Protección solo para administradores
/*
<Route path="/system-config" element={
  <RoleProtectedRoute requireAdmin={true}>
    <AppLayout><SystemConfig /></AppLayout>
  </RoleProtectedRoute>
} />
*/

// EJEMPLO 4: Protección combinada (admin + roles específicos)
/*
<Route path="/user-management" element={
  <RoleProtectedRoute allowedRoles={['admin', 'manager']} requireAdmin={false}>
    <AppLayout><UserManagement /></AppLayout>
  </RoleProtectedRoute>
} />
*/

// FUNCIONALIDADES:
// ✅ Redirige a /login si no está autenticado
// ✅ Guarda la ruta original para redirigir después del login
// ✅ Muestra loading mientras verifica autenticación
// ✅ Protección por roles (opcional)
// ✅ Mensajes de error personalizados
// ✅ Protección para admin (opcional)

export default {};