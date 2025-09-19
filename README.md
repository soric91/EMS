# EMS - Energy Monitoring System

## 🔋 Descripción del Proyecto

EMS (Energy Monitoring System) es un sistema completo de monitoreo energético diseñado para la gestión y supervisión de dispositivos de medición de energía. El sistema permite la recolección, procesamiento y visualización de datos energéticos en tiempo real a través de una interfaz web moderna y una API robusta.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WebServer     │    │   gatewayApi    │    │   gatewayEMS    │
│   (React App)   │◄──►│   (FastAPI)     │◄──►│   (Data Gateway)│
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • REST API      │    │ • Device Comm   │
│ • Device Config │    │ • Authentication│    │ • Data Collection│
│ • Monitoring    │    │ • User Management│   │ • Modbus Protocol│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                       ┌─────────────────┐
                       │   MongoDB       │
                       │   (Database)    │
                       │                 │
                       │ • User Data     │
                       │ • Device Config │
                       │ • Energy Data   │
                       └─────────────────┘
```

## 📦 Componentes del Sistema

### 🖥️ [WebServer](./WebServer/)
- **Tecnología**: React 19 + RSBuild + TailwindCSS
- **Funcionalidad**: Interfaz de usuario para visualización y gestión
- **Puerto**: 3000

### 🚀 [gatewayApi](./gatewayApi/)
- **Tecnología**: FastAPI + MongoDB
- **Funcionalidad**: API REST para gestión de datos y autenticación
- **Puerto**: 8000

### 🔌 [gatewayEMS](./gatewayEMS/)
- **Tecnología**: Python + Modbus
- **Funcionalidad**: Gateway para comunicación con dispositivos
- **Protocolo**: Modbus RTU/TCP

### 📁 [Shared](./Shared/)
- **Funcionalidad**: Configuraciones y logs compartidos
- **Contenido**: config.ini, logs del sistema

## 🚀 Instalación y Configuración

### Prerrequisitos
- Docker y Docker Compose
- Python 3.12+
- Node.js 18+
- MongoDB 4.2+

### Configuración Rápida con Docker

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd EMS
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. **Levantar los servicios**
```bash
docker-compose up -d
```

4. **Acceder a la aplicación**
- Web Interface: http://localhost:3000
- API Documentation: http://localhost:8000/docs
- MongoDB: localhost:27017

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Web Server
port=3000

# Database
db_port=27017
db_user=admin
db_password=password
db_name=ems_database

# Security
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 📊 Características Principales

### ⚡ Monitoreo en Tiempo Real
- Dashboard con métricas energéticas
- Visualización de consumo por dispositivo
- Alertas y notificaciones

### 🔧 Gestión de Dispositivos
- Configuración de dispositivos Modbus
- Gestión de registros y parámetros
- Estado de conexión en tiempo real

### 👥 Gestión de Usuarios
- Sistema de autenticación JWT
- Roles y permisos
- Sesiones seguras

### 📈 Análisis de Datos
- Histórico de consumo
- Reportes personalizables
- Exportación de datos

## 🛠️ Desarrollo

### Estructura del Proyecto
```
EMS/
├── WebServer/          # Frontend React
├── gatewayApi/         # Backend API
├── gatewayEMS/         # Device Gateway
├── Shared/             # Configuraciones compartidas
├── docker-compose.yml  # Orquestación de servicios
└── README.md          # Este archivo
```

### Comandos de Desarrollo

```bash
# Desarrollo del frontend
cd WebServer
npm run dev

# Desarrollo del backend
cd gatewayApi
uv run uvicorn src.app:app --reload

# Desarrollo del gateway
cd gatewayEMS
uv run python main.py
```

## 🔍 Logs y Monitoreo

- **Logs compartidos**: `./Shared/gateway_ems.log`
- **Configuración**: `./Shared/config.ini`
- **Logs por servicio**: Cada servicio mantiene sus propios logs

## 📝 API Documentation

Una vez levantado el sistema, la documentación de la API estará disponible en:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Para soporte o preguntas:
- 📧 Email: soporte@ems-project.com
- 📋 Issues: [GitHub Issues](https://github.com/your-repo/EMS/issues)
- 📖 Wiki: [Project Wiki](https://github.com/your-repo/EMS/wiki)
