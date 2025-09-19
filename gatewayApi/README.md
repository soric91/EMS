# 🚀 Gateway API - Backend EMS

## 📋 Descripción

El Gateway API es el backend principal del sistema EMS, construido con FastAPI. Proporciona una API REST robusta para la gestión de usuarios, autenticación, configuración de dispositivos y almacenamiento de datos energéticos.

## 🚀 Tecnologías Utilizadas

- **FastAPI** - Framework web moderno y rápido para APIs
- **MongoDB** - Base de datos NoSQL para almacenamiento
- **PyMongo** - Driver oficial de MongoDB para Python
- **Pydantic** - Validación de datos y serialización
- **JWT** - JSON Web Tokens para autenticación
- **Uvicorn** - Servidor ASGI de alto rendimiento
- **UV** - Gestor de dependencias rápido

## 📁 Estructura del Proyecto

```
gatewayApi/
├── src/
│   ├── auth/                # Autenticación y seguridad
│   │   ├── dependencies.py  # Dependencias de autenticación
│   │   ├── jwt_handler.py   # Manejo de JWT tokens
│   │   └── security.py      # Utilidades de seguridad
│   ├── routes/              # Endpoints de la API
│   │   ├── auth.py         # Rutas de autenticación
│   │   ├── device.py       # Rutas de dispositivos
│   │   ├── login.py        # Rutas de login
│   │   └── users.py        # Rutas de usuarios
│   ├── models/              # Modelos de datos
│   │   └── model.py        # Esquemas Pydantic
│   ├── services/            # Lógica de negocio
│   │   ├── service.py      # Servicios generales
│   │   └── user_service.py # Servicios de usuario
│   ├── repositories/        # Acceso a datos
│   │   ├── repository.py   # Repositorio base
│   │   └── user_repository.py # Repositorio de usuarios
│   ├── database/            # Configuración de BD
│   │   ├── connection.py   # Conexión MongoDB
│   │   └── dependencies.py # Dependencias de BD
│   ├── core/                # Configuración central
│   │   └── config.py       # Configuración de la app
│   ├── config/              # Archivos de configuración
│   │   └── config.ini      # Configuración INI
│   ├── util/                # Utilidades
│   │   └── logging.py      # Configuración de logs
│   ├── scripts/             # Scripts de utilidad
│   │   └── init_admin.py   # Inicialización de admin
│   └── app.py              # Aplicación principal FastAPI
├── main.py                 # Punto de entrada
├── pyproject.toml          # Configuración del proyecto
├── uv.lock                 # Lockfile de dependencias
├── Dockerfile              # Configuración Docker
└── test.py                 # Tests
```

## ⚡ Instalación y Configuración

### Prerrequisitos
- Python 3.12 o superior
- UV (gestor de dependencias)
- MongoDB 4.2 o superior

### Instalación Local

```bash
# Instalar UV si no lo tienes
curl -LsSf https://astral.sh/uv/install.sh | sh

# Instalar dependencias
uv sync

# Activar entorno virtual
source .venv/bin/activate  # Linux/Mac
# o
.venv\Scripts\activate     # Windows
```

### Variables de Entorno

Configura las variables en `.env` o en el sistema:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Database
MONGO_URL=mongodb://admin:password@localhost:27017
DATABASE_NAME=ems_database

# Security
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=INFO
LOG_FILE=./log/gateway_ems.log
```

## 🛠️ Scripts de Desarrollo

```bash
# Desarrollo con recarga automática
uv run uvicorn src.app:app --reload --host 0.0.0.0 --port 8000

# Ejecutar usando main.py
uv run python main.py

# Tests
uv run pytest
uv run python test.py

# Linting y formato
uv run ruff check
uv run ruff format

# Docker
docker build -t ems-api .
docker run -p 8000:8000 ems-api
```

## 📚 API Endpoints

### 🔐 Autenticación

```http
POST   /auth/login          # Iniciar sesión
POST   /auth/refresh        # Renovar token
POST   /auth/logout         # Cerrar sesión
GET    /auth/verify         # Verificar token
```

### 👥 Usuarios

```http
GET    /users               # Listar usuarios
POST   /users               # Crear usuario
GET    /users/{id}          # Obtener usuario
PUT    /users/{id}          # Actualizar usuario
DELETE /users/{id}          # Eliminar usuario
GET    /users/me            # Perfil actual
```

### 🔧 Dispositivos

```http
GET    /devices             # Listar dispositivos
POST   /devices             # Crear dispositivo
GET    /devices/{id}        # Obtener dispositivo
PUT    /devices/{id}        # Actualizar dispositivo
DELETE /devices/{id}        # Eliminar dispositivo
GET    /devices/{id}/data   # Datos del dispositivo
POST   /devices/{id}/config # Configurar dispositivo
```

### 📈 Datos y Métricas

```http
GET    /data/energy         # Datos energéticos
GET    /data/metrics        # Métricas del sistema
GET    /data/history        # Histórico de datos
POST   /data/bulk           # Inserción masiva
```

### 🗺️ Health Check

```http
GET    /health              # Estado de la API
GET    /health/db           # Estado de la BD
GET    /health/detailed     # Chequeo detallado
```

## 🔒 Sistema de Autenticación

### JWT Implementation
- **Access Token**: 30 minutos de duración
- **Refresh Token**: 7 días de duración
- **Algorithm**: HS256
- **Claims**: user_id, username, role, exp, iat

### Protección de Rutas
```python
from src.auth.dependencies import get_current_user, require_admin

@app.get("/protected")
async def protected_route(current_user: User = Depends(get_current_user)):
    return {"user": current_user.username}

@app.get("/admin-only")
async def admin_route(current_user: User = Depends(require_admin)):
    return {"message": "Admin access granted"}
```

## 📦 Modelos de Datos

### Usuario
```python
class User(BaseModel):
    id: Optional[str] = None
    username: str
    email: str
    full_name: Optional[str] = None
    role: UserRole = UserRole.USER
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
```

### Dispositivo
```python
class Device(BaseModel):
    id: Optional[str] = None
    name: str
    device_type: DeviceType
    modbus_config: ModbusConfig
    registers: List[Register]
    status: DeviceStatus
    location: Optional[str] = None
    created_at: datetime
    updated_at: datetime
```

### Configuración Modbus
```python
class ModbusConfig(BaseModel):
    slave_id: int
    host: str
    port: int = 502
    timeout: int = 3
    protocol: ModbusProtocol = ModbusProtocol.TCP
```

## 📊 Base de Datos MongoDB

### Colecciones Principales
- **users**: Usuarios del sistema
- **devices**: Dispositivos configurados
- **energy_data**: Datos energéticos históricos
- **device_logs**: Logs de dispositivos
- **system_config**: Configuración del sistema

### Índices Optimizados
```javascript
// Índices para consultas eficientes
db.energy_data.createIndex({ "device_id": 1, "timestamp": -1 })
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.devices.createIndex({ "name": 1 }, { unique: true })
```

## 🔍 Logging y Monitoreo

### Configuración de Logs
- **Level**: INFO por defecto
- **Format**: JSON estructurado
- **Rotation**: Diario con retención de 30 días
- **Destinos**: Archivo y consola

### Métricas Disponibles
- Tiempo de respuesta por endpoint
- Número de requests por minuto
- Errores y excepciones
- Estado de conexiones de BD
- Uso de memoria y CPU

## 🧪 Testing

### Estructura de Tests
```bash
# Tests unitarios
uv run pytest tests/unit/

# Tests de integración
uv run pytest tests/integration/

# Coverage report
uv run pytest --cov=src --cov-report=html

# Tests con salida detallada
uv run pytest -v
```

### Ejemplo de Test
```python
def test_create_user():
    response = client.post(
        "/users",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123"
        }
    )
    assert response.status_code == 201
    assert response.json()["username"] == "testuser"
```

## 🔧 Configuración Avanzada

### CORS Configuration
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Rate Limiting
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

@app.get("/api/data")
@limiter.limit("100/minute")
async def get_data(request: Request):
    return {"data": "sensitive_data"}
```

## 🚀 Deployment

### Docker Production
```dockerfile
# Multi-stage build para optimizar tamaño
FROM python:3.12-slim as builder
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync --frozen

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /app/.venv /app/.venv
COPY . .
EXPOSE 8000
CMD [".venv/bin/uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production
```bash
# Configuración de producción
export ENVIRONMENT=production
export LOG_LEVEL=WARNING
export JWT_SECRET_KEY=$(openssl rand -hex 32)
export MONGO_URL=mongodb://user:pass@mongo-cluster:27017
```

## 📊 Performance Optimizations

### Database Connection Pool
```python
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(
    settings.MONGO_URL,
    maxPoolSize=50,
    minPoolSize=10,
    maxIdleTimeMS=30000,
)
```

### Response Caching
```python
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

@app.get("/devices")
@cache(expire=300)  # 5 minutos
async def get_devices():
    return await device_service.get_all()
```

## 🔍 API Documentation

### Swagger UI
- **URL**: http://localhost:8000/docs
- **Features**: Interactive API testing, schema validation
- **Customization**: Custom styling and branding

### ReDoc
- **URL**: http://localhost:8000/redoc
- **Features**: Better documentation layout
- **Export**: OpenAPI JSON/YAML

## 🐛 Troubleshooting

### Problemas Comunes

1. **Database Connection Issues**
```bash
# Verificar conexión MongoDB
mongosh $MONGO_URL --eval "db.adminCommand('ismaster')"
```

2. **JWT Token Problems**
```bash
# Verificar secret key
echo $JWT_SECRET_KEY | base64 -d
```

3. **Port Already in Use**
```bash
# Encontrar proceso usando el puerto
lsof -i :8000
kill -9 <PID>
```

### Debug Mode
```bash
# Ejecutar en modo debug
DEBUG=1 uv run uvicorn src.app:app --reload --log-level debug
```

## 📄 API Versioning

### Version Strategy
- **Current**: v1
- **URL Pattern**: `/api/v1/endpoint`
- **Headers**: `Accept: application/vnd.api+json;version=1`

## 🔒 Security Best Practices

- **Password Hashing**: bcrypt with salt
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization
- **Rate Limiting**: Per IP and per user
- **HTTPS Only**: In production
- **Security Headers**: Implemented via middleware

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para feature
3. Seguir PEP 8 y usar ruff para linting
4. Añadir tests para nueva funcionalidad
5. Actualizar documentación
6. Pull Request con descripción detallada
