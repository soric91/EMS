# 🖥️ WebServer - Frontend EMS

## 📋 Descripción

El WebServer es la interfaz de usuario frontend del sistema EMS, construida con React 19 y tecnologías modernas. Proporciona una interfaz intuitiva para el monitoreo energético, gestión de dispositivos y administración del sistema.

## 🚀 Tecnologías Utilizadas

- **React 19** - Framework de interfaz de usuario
- **RSBuild** - Build tool rápido y moderno
- **TailwindCSS 4.x** - Framework de estilos utility-first
- **React Router Dom** - Enrutamiento del lado cliente
- **Framer Motion** - Animaciones y transiciones
- **Axios** - Cliente HTTP para API calls
- **React Hook Form** - Manejo de formularios
- **Lucide React** - Iconografía moderna

## 📁 Estructura del Proyecto

```
WebServer/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── auth/           # Componentes de autenticación
│   │   ├── configDevice/   # Gestión de dispositivos
│   │   ├── Devices/        # Monitoreo de dispositivos
│   │   ├── home/           # Dashboard principal
│   │   ├── Layout/         # Layout de la aplicación
│   │   ├── Login/          # Componentes de login
│   │   ├── Sidebar/        # Barra lateral de navegación
│   │   └── ui/             # Componentes UI base
│   ├── pages/              # Páginas de la aplicación
│   ├── hooks/              # Custom React hooks
│   ├── context/            # Context API y estado global
│   ├── api/                # Servicios API
│   ├── utils/              # Utilidades y helpers
│   └── Asset/              # Recursos estáticos
├── public/                 # Archivos públicos
├── Dockerfile             # Configuración Docker
└── package.json           # Dependencias y scripts
```

## ⚡ Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- npm o pnpm

### Instalación Local

```bash
# Instalar dependencias
npm install
# o usando pnpm
pnpm install
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del WebServer:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_VERSION=v1

# Application Settings
REACT_APP_NAME="EMS - Energy Monitoring System"
REACT_APP_VERSION=1.0.0
```

## 🛠️ Scripts de Desarrollo

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
pnpm dev

# Producción
npm run build        # Construir para producción
npm run preview      # Vista previa del build

# Docker
docker build -t ems-frontend .
docker run -p 3000:3000 ems-frontend
```

## 🎯 Características Principales

### 🔐 Sistema de Autenticación
- Login seguro con JWT
- Gestión de sesiones
- Protección de rutas
- Refresh token automático

### 📊 Dashboard Principal
- Métricas energéticas en tiempo real
- Visualización de consumo por dispositivos
- Diagrama interactivo del sistema EMS
- Cards informativos con estadísticas clave

### 🔧 Gestión de Dispositivos
- Configuración de dispositivos Modbus
- CRUD completo de dispositivos
- Gestión de registros y parámetros
- Estado de conexión en tiempo real
- Validación de formularios avanzada

### 👥 Administración de Usuarios
- Gestión de usuarios del sistema
- Roles y permisos
- Perfil de usuario editable

### 📈 Monitoreo y Logs
- Visualización de logs del sistema
- Métricas históricas
- Alertas y notificaciones

## 🧩 Componentes Destacados

### Layout System
- `AppLayout`: Layout principal con sidebar y header
- `SidebarContainer`: Navegación lateral responsive
- `MainContent`: Área principal de contenido
- `TopBar`: Barra superior con información de usuario

### Device Management
- `DeviceTable`: Tabla interactiva de dispositivos
- `AddDeviceModal`: Modal para agregar dispositivos
- `DeviceConfig`: Configuración detallada por dispositivo
- `RegistersTable`: Gestión de registros Modbus

### Dashboard Components
- `EnergyDiagram`: Diagrama interactivo del sistema
- `StatsCard`: Cards de estadísticas
- `ConnectionStatus`: Estado de conexión en tiempo real

## 🎨 Sistema de Estilos

### TailwindCSS Configuration
- Configuración personalizada en `postcss.config.mjs`
- Clases utility-first para rapid prototyping
- Responsive design por defecto
- Dark mode ready (próximamente)

### Componentes UI Base
- Botones personalizados con variantes
- Inputs con validación visual
- Modales reutilizables
- Tablas responsivas

## 🔧 Custom Hooks

- `useAuth`: Manejo de autenticación
- `useDeviceConfig`: Gestión de configuración de dispositivos
- `useDeviceForm`: Formularios de dispositivos
- `useModalState`: Estado de modales
- `useSidebar`: Control del sidebar
- `useAppLayout`: Layout management

## 🌐 Integración API

### Servicios API
- `apiUser.js`: Operaciones de usuarios y autenticación
- `apiModbus.js`: Operaciones de dispositivos Modbus
- `axios.js`: Configuración base de Axios

### Interceptors
- Manejo automático de tokens JWT
- Refresh token automático
- Manejo global de errores
- Loading states centralizados

## 🚀 Optimizaciones de Performance

- **Code Splitting**: Lazy loading de componentes
- **Memoization**: React.memo en componentes pesados
- **Bundle Optimization**: RSBuild optimización automática
- **Image Optimization**: Optimización de assets

## 📱 Responsive Design

- **Mobile First**: Diseño adaptado para móviles
- **Breakpoints**: sm, md, lg, xl configurados
- **Touch Friendly**: Elementos táctiles optimizados
- **Progressive Enhancement**: Funcionalidad progresiva

## 🧪 Testing (En desarrollo)

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🔍 Debugging

### React Developer Tools
- Extensión recomendada para debugging
- Context inspection
- Performance profiling

### Logging
- Console logs en desarrollo
- Error boundary para captura de errores
- Network requests logging

## 📦 Build y Deploy

### Desarrollo
```bash
npm run dev
# Disponible en http://localhost:3000
```

### Producción
```bash
npm run build
npm run preview
```

### Docker
```bash
docker build -t ems-frontend .
docker run -p 3000:3000 ems-frontend
```

## 🔄 Estado Global

### Context API
- `GlobalState.jsx`: Estado global de la aplicación
- `AppReducer.jsx`: Reducer para manejo de estado
- Actions para operaciones comunes

## 📚 Recursos Adicionales

- [React 19 Documentation](https://react.dev/)
- [RSBuild Documentation](https://rsbuild.rs/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)

## 🐛 Troubleshooting

### Problemas Comunes
1. **Ports en uso**: Cambiar puerto en `rsbuild.config.mjs`
2. **API Connection**: Verificar variables de entorno
3. **Build errors**: Limpiar node_modules y reinstalar

### Logs de Debug
```bash
# Ver logs detallados
DEBUG=* npm run dev
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear branch para feature
3. Seguir convenciones de código
4. Añadir tests si es necesario
5. Pull Request con descripción detallada
