# 🔌 Gateway EMS - Device Communication Gateway

## 📋 Descripción

El Gateway EMS es el componente encargado de la comunicación con dispositivos de medición energética. Actúa como puente entre los dispositivos físicos (usando protocolo Modbus) y el sistema EMS, recolectando datos en tiempo real y enviándolos a la base de datos a través de la API.

## 🚀 Tecnologías Utilizadas

- **Python 3.12** - Lenguaje principal
- **Modbus** - Protocolo de comunicación industrial
- **PyModbusTCP/PyModbusSerial** - Librerías Modbus para Python
- **ConfigParser** - Manejo de archivos de configuración
- **Logging** - Sistema de logs robusto
- **Threading/AsyncIO** - Concurrencia para múltiples dispositivos
- **UV** - Gestor de dependencias moderno

## 📁 Estructura del Proyecto

```
gatewayEMS/
├── config/
│   ├── config.ini          # Configuración principal
│   └── config.py           # Manager de configuración
├── src/
│   ├── modbus/             # Módulos Modbus
│   │   ├── client.py       # Cliente Modbus TCP/RTU
│   │   ├── device.py       # Abstracción de dispositivos
│   │   └── protocol.py     # Implementación del protocolo
│   ├── data/               # Procesamiento de datos
│   │   ├── collector.py    # Recolector de datos
│   │   ├── processor.py    # Procesador de datos
│   │   └── validator.py    # Validación de datos
│   ├── communication/      # Comunicación con API
│   │   ├── api_client.py   # Cliente API REST
│   │   └── queue.py        # Cola de datos
│   ├── utils/              # Utilidades
│   │   ├── logger.py       # Configuración de logs
│   │   ├── scheduler.py    # Programador de tareas
│   │   └── helpers.py      # Funciones auxiliares
│   └── services/           # Servicios principales
│       ├── device_service.py # Servicio de dispositivos
│       ├── data_service.py   # Servicio de datos
│       └── monitor_service.py # Servicio de monitoreo
├── log/
│   └── gateway_ems.log     # Archivo de logs
├── main.py                 # Punto de entrada principal
├── pyproject.toml          # Configuración del proyecto
├── uv.lock                 # Lockfile de dependencias
└── Dockerfile             # Configuración Docker
```

## ⚡ Instalación y Configuración

### Prerrequisitos
- Python 3.12 o superior
- UV (gestor de dependencias)
- Acceso a dispositivos Modbus (TCP/RTU)
- Permisos para puertos serie (para Modbus RTU)

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

### Configuración de Dispositivos

Edita el archivo `config/config.ini`:

```ini
[DEFAULT]
log_level = INFO
log_file = ./log/gateway_ems.log
api_url = http://localhost:8000
api_timeout = 30
collection_interval = 60

[DEVICE_1]
name = Energy_Meter_01
type = ENERGY_METER
protocol = TCP
host = 192.168.1.100
port = 502
slave_id = 1
timeout = 3
registers = 30001,30003,30005,30007
register_types = HOLDING,HOLDING,HOLDING,HOLDING
data_types = FLOAT32,FLOAT32,FLOAT32,FLOAT32
labels = Voltage_L1,Voltage_L2,Voltage_L3,Current_L1

[DEVICE_2]
name = Power_Analyzer_01
type = POWER_ANALYZER
protocol = RTU
port = /dev/ttyUSB0
baudrate = 9600
parity = N
stopbits = 1
databits = 8
slave_id = 2
timeout = 5
registers = 40001,40003,40005
register_types = HOLDING,HOLDING,HOLDING
data_types = INT16,INT16,FLOAT32
labels = Active_Power,Reactive_Power,Power_Factor
```

### Variables de Entorno

```env
# API Configuration
EMS_API_URL=http://localhost:8000
EMS_API_TOKEN=your-api-token
EMS_API_TIMEOUT=30

# Device Settings
COLLECTION_INTERVAL=60
MAX_RETRIES=3
RETRY_DELAY=5

# Logging
LOG_LEVEL=INFO
LOG_FILE=./log/gateway_ems.log
LOG_MAX_SIZE=10MB
LOG_BACKUP_COUNT=5

# Serial Port (for Modbus RTU)
SERIAL_TIMEOUT=3
SERIAL_BAUDRATE=9600
SERIAL_PARITY=N
```

## 🛠️ Scripts de Desarrollo

```bash
# Ejecutar gateway
uv run python main.py

# Ejecutar en modo debug
DEBUG=1 uv run python main.py

# Tests
uv run pytest
uv run python -m pytest tests/ -v

# Linting y formato
uv run ruff check
uv run ruff format

# Verificar dispositivos Modbus
uv run python -c "from src.modbus.client import test_connection; test_connection()"

# Docker
docker build -t ems-gateway .
docker run --device=/dev/ttyUSB0 -v ./config:/app/config ems-gateway
```

## 🔧 Configuración de Dispositivos

### Protocolo Modbus TCP
```ini
[DEVICE_TCP]
protocol = TCP
host = 192.168.1.100    # IP del dispositivo
port = 502              # Puerto Modbus (default 502)
slave_id = 1            # ID del esclavo
timeout = 3             # Timeout en segundos
```

### Protocolo Modbus RTU
```ini
[DEVICE_RTU]
protocol = RTU
port = /dev/ttyUSB0     # Puerto serie
baudrate = 9600         # Velocidad
parity = N              # Paridad (N/E/O)
stopbits = 1            # Bits de parada
databits = 8            # Bits de datos
slave_id = 1            # ID del esclavo
timeout = 5             # Timeout en segundos
```

### Configuración de Registros

```ini
# Tipos de registros Modbus
# COIL (0x)
# DISCRETE_INPUT (1x)
# HOLDING_REGISTER (4x)
# INPUT_REGISTER (3x)

registers = 30001,30003,30005       # Direcciones de registros
register_types = HOLDING,HOLDING,HOLDING  # Tipos de registros
data_types = FLOAT32,INT16,UINT16   # Tipos de datos
labels = Voltage,Current,Power      # Etiquetas descriptivas
units = V,A,W                       # Unidades de medida
scaling_factors = 1.0,0.1,1.0       # Factores de escala
```

## 📊 Procesamiento de Datos

### Flujo de Datos

1. **Recolección**: El gateway lee datos de dispositivos Modbus
2. **Validación**: Verifica integridad y validez de los datos
3. **Procesamiento**: Aplica transformaciones y cálculos
4. **Almacenamiento Local**: Guarda en cola temporal
5. **Transmisión**: Envía datos a la API del sistema

### Tipos de Datos Soportados

```python
# Tipos de datos Modbus
DATA_TYPES = {
    'INT16': lambda x: int(x),
    'UINT16': lambda x: int(x) if x >= 0 else 65536 + x,
    'INT32': lambda x: x,
    'UINT32': lambda x: x,
    'FLOAT32': lambda x: float(x),
    'FLOAT64': lambda x: float(x),
    'BOOL': lambda x: bool(x),
    'STRING': lambda x: str(x)
}
```

### Ejemplo de Procesador de Datos

```python
class EnergyDataProcessor:
    def process_raw_data(self, device_id: str, raw_data: dict) -> dict:
        processed_data = {
            'device_id': device_id,
            'timestamp': datetime.now().isoformat(),
            'measurements': {}
        }
        
        for register, value in raw_data.items():
            # Aplicar factor de escala
            scaled_value = value * self.get_scaling_factor(register)
            
            # Validar rango
            if self.is_valid_range(register, scaled_value):
                processed_data['measurements'][register] = {
                    'value': scaled_value,
                    'unit': self.get_unit(register),
                    'quality': 'GOOD'
                }
            else:
                processed_data['measurements'][register] = {
                    'value': None,
                    'unit': self.get_unit(register),
                    'quality': 'BAD_RANGE'
                }
        
        return processed_data
```

## 🔄 Servicios Principales

### Device Service
- Gestión de conexiones con dispositivos
- Configuración dinámica de dispositivos
- Monitoreo de estado de conexión
- Reconexión automática

### Data Service
- Recolección periódica de datos
- Validación y procesamiento
- Cola de datos para transmisión
- Gestión de errores

### Monitor Service
- Supervisión del estado del sistema
- Métricas de rendimiento
- Alertas y notificaciones
- Health checks

## 🔍 Logging y Monitoreo

### Configuración de Logs

```python
import logging
from logging.handlers import RotatingFileHandler

# Configuración del logger
logger = logging.getLogger('gateway_ems')
logger.setLevel(logging.INFO)

# Handler para archivo con rotación
file_handler = RotatingFileHandler(
    'log/gateway_ems.log',
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5
)

# Formato de logs
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)
```

### Métricas del Sistema

- **Dispositivos conectados**: Número de dispositivos activos
- **Tasa de recolección**: Datos por minuto
- **Errores de comunicación**: Fallos por dispositivo
- **Latencia de respuesta**: Tiempo de respuesta Modbus
- **Uso de memoria**: Consumo de recursos
- **Cola de datos**: Tamaño de buffer

## 🧪 Testing

### Tests Unitarios

```python
import pytest
from src.modbus.client import ModbusClient

def test_modbus_tcp_connection():
    client = ModbusClient(host='192.168.1.100', port=502)
    assert client.connect() == True
    assert client.is_connected() == True
    client.disconnect()

def test_data_validation():
    from src.data.validator import DataValidator
    validator = DataValidator()
    
    # Test valid data
    assert validator.validate_float(220.5) == True
    assert validator.validate_range(220.5, 0, 300) == True
    
    # Test invalid data
    assert validator.validate_range(350, 0, 300) == False
```

### Tests de Integración

```bash
# Test completo del sistema
uv run pytest tests/integration/

# Test específico de dispositivos
uv run pytest tests/test_devices.py -v

# Test con dispositivos reales
TEST_REAL_DEVICES=1 uv run pytest tests/
```

## 🚀 Deployment

### Docker

```dockerfile
FROM python:3.12-slim

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instalar UV y dependencias Python
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync --frozen

# Copiar código fuente
COPY . .

# Crear directorio de logs
RUN mkdir -p log

# Exponer puertos si es necesario
# EXPOSE 502

# Ejecutar aplicación
CMD [".venv/bin/python", "main.py"]
```

### Docker Compose con Devices

```yaml
services:
  gatewayems:
    build: .
    container_name: gateway_ems
    volumes:
      - ./config:/app/config
      - ./log:/app/log
    devices:
      - /dev/ttyUSB0:/dev/ttyUSB0  # Para Modbus RTU
    environment:
      - LOG_LEVEL=INFO
      - EMS_API_URL=http://api:8000
    networks:
      - ems_network
    restart: unless-stopped
```

## 🔧 Configuración Avanzada

### Múltiples Dispositivos

```python
class MultiDeviceManager:
    def __init__(self, config_manager):
        self.devices = {}
        self.collectors = {}
        
    async def start_all_collectors(self):
        for device_id, device_config in self.get_all_devices():
            collector = DataCollector(device_config)
            self.collectors[device_id] = collector
            await collector.start()
    
    def get_system_status(self):
        return {
            'total_devices': len(self.devices),
            'active_devices': sum(1 for d in self.devices.values() if d.is_connected()),
            'data_points_collected': self.get_total_data_points(),
            'last_collection': self.get_last_collection_time()
        }
```

### Reconexión Automática

```python
class ReconnectionManager:
    def __init__(self, max_retries=5, base_delay=5):
        self.max_retries = max_retries
        self.base_delay = base_delay
    
    async def reconnect_with_backoff(self, device):
        for attempt in range(self.max_retries):
            try:
                await device.connect()
                logger.info(f"Device {device.name} reconnected successfully")
                return True
            except Exception as e:
                delay = self.base_delay * (2 ** attempt)
                logger.warning(f"Reconnection attempt {attempt + 1} failed, retrying in {delay}s")
                await asyncio.sleep(delay)
        
        logger.error(f"Failed to reconnect device {device.name} after {self.max_retries} attempts")
        return False
```

## 📈 Performance Optimization

### Concurrent Data Collection

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

class OptimizedDataCollector:
    def __init__(self, max_workers=10):
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
    
    async def collect_from_all_devices(self, devices):
        loop = asyncio.get_event_loop()
        tasks = []
        
        for device in devices:
            task = loop.run_in_executor(
                self.executor,
                self.collect_device_data,
                device
            )
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return self.process_results(results)
```

### Data Buffering

```python
from collections import deque
import threading

class DataBuffer:
    def __init__(self, max_size=1000):
        self.buffer = deque(maxlen=max_size)
        self.lock = threading.Lock()
    
    def add_data(self, data):
        with self.lock:
            self.buffer.append(data)
    
    def get_batch(self, size=100):
        with self.lock:
            batch = []
            for _ in range(min(size, len(self.buffer))):
                if self.buffer:
                    batch.append(self.buffer.popleft())
            return batch
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **Errores de Conexión Modbus**
```bash
# Verificar conectividad TCP
telnet 192.168.1.100 502

# Verificar puerto serie
ls -la /dev/ttyUSB*
sudo chmod 666 /dev/ttyUSB0

# Test de comunicación
uv run python -c "from src.utils.modbus_test import test_device; test_device('192.168.1.100', 502)"
```

2. **Problemas de Permisos**
```bash
# Agregar usuario al grupo dialout (para puertos serie)
sudo usermod -a -G dialout $USER

# Cambiar permisos del puerto
sudo chmod 666 /dev/ttyUSB0
```

3. **Errores de Configuración**
```bash
# Validar archivo de configuración
uv run python -c "from config.config import ConfigManager; cm = ConfigManager(); print(cm.validate_config())"

# Ver configuración cargada
uv run python -c "from config.config import ConfigManager; cm = ConfigManager(); cm.print_config()"
```

### Debug Mode

```bash
# Ejecutar con debug completo
DEBUG=1 LOG_LEVEL=DEBUG uv run python main.py

# Logs detallados de Modbus
MODBUS_DEBUG=1 uv run python main.py

# Test individual de dispositivo
TEST_DEVICE=DEVICE_1 uv run python main.py
```

## 📋 Checklist de Deployment

- [ ] Configurar dispositivos en `config.ini`
- [ ] Verificar conectividad de red/serie
- [ ] Configurar variables de entorno
- [ ] Probar conexión con API
- [ ] Configurar logs y monitoreo
- [ ] Probar reconexión automática
- [ ] Configurar alertas
- [ ] Documentar configuración específica

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para feature
3. Agregar tests para nueva funcionalidad
4. Seguir PEP 8 para estilo de código
5. Actualizar documentación
6. Pull Request con descripción detallada

## 📚 Referencias

- [Modbus Protocol Specification](http://www.modbus.org/docs/Modbus_Application_Protocol_V1_1b3.pdf)
- [PyModbusTCP Documentation](https://pymodbustcp.readthedocs.io/)
- [Python Async Programming](https://docs.python.org/3/library/asyncio.html)
- [Industrial Communication Protocols](https://en.wikipedia.org/wiki/Modbus)
