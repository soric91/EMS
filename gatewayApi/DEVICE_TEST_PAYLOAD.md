# Ejemplo de payload para probar el endpoint POST /api/ems/device

## Payload de prueba para dispositivo EMS

```json
{
  "id": 1,
  "name": "CT_Meter_01",
  "type": "CT Meter",
  "protocol": "RTU",
  "ip": "",
  "serialPort": "/dev/ttyRS485",
  "baudRate": 9600,
  "parity": "None",
  "dataBits": 8,
  "stopBits": 1,
  "modbusId": 1,
  "startAddress": 0,
  "registers": 10
}
```

## Comando cURL para probar

Primero necesitas obtener un token JWT válido. Luego puedes usar este comando:

```bash
curl -X POST "http://localhost:8000/api/ems/add/device/modbus" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInNjb3BlcyI6WyJyZWFkIiwid3JpdGUiLCJhZG1pbiJdLCJ1c2VyX2lkIjoiNjhjOTg4MjEyNTE3MTA5ZjNiNWU2ZTIyIiwiZXhwIjoxNzU4MTM3MzQ2LCJ0eXBlIjoiYWNjZXNzIn0.9LEO1-8r_eiI9-QGHjQdwNypubAgtDCxY7aUWrTkAbI" \
  -d '{
    "id": 1,
    "name": "CT_Meter_01",
    "type": "CT Meter",
    "protocol": "RTU",
    "ip": "",
    "serialPort": "/dev/ttyRS485",
    "baudRate": 9600,
    "parity": "None",
    "dataBits": 8,
    "stopBits": 1,
    "modbusId": 1,
    "startAddress": 0,
    "registers": 10
  }'
```

## Ejemplo con Python usando requests

```python
import requests
import json

# URL del endpoint
url = "http://localhost:3001/api/ems/device/"

# Payload del dispositivo
device_payload = {
    "id": 1,
    "name": "CT_Meter_01",
    "type": "CT Meter",
    "protocol": "RTU",
    "ip": "",
    "serialPort": "/dev/ttyRS485",
    "baudRate": 9600,
    "parity": "None",
    "dataBits": 8,
    "stopBits": 1,
    "modbusId": 1,
    "startAddress": 0,
    "registers": 10
}

# Headers con token JWT (reemplaza con tu token real)
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}

# Realizar la petición
response = requests.post(url, json=device_payload, headers=headers)

# Mostrar resultado
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")
```

## Respuesta esperada

Si todo funciona correctamente, deberías recibir:

```json
{
  "name": "CT_Meter_01",
  "success": true
}
```

## Verificación en config.ini

Después de enviar el payload, puedes verificar que el dispositivo se guardó correctamente en `/home/kurosaki/Documentos/projects/EMS/Shared/config.ini`. Debería aparecer una nueva sección:

```ini
[CT_Meter_01]
id = 1
type = CT Meter
protocol = RTU
ip = 
serialport = /dev/ttyRS485
baudrate = 9600
parity = None
databits = 8
stopbits = 1
modbusid = 1
startaddress = 0
registers = 10
```

## Otros ejemplos de payload

### Dispositivo con IP (TCP):
```json
{
  "id": 2,
  "name": "Energy_Meter_TCP",
  "type": "Energy Meter",
  "protocol": "TCP",
  "ip": "192.168.1.100",
  "serialPort": "",
  "baudRate": 9600,
  "parity": "Even",
  "dataBits": 8,
  "stopBits": 1,
  "modbusId": 2,
  "startAddress": 100,
  "registers": 20
}
```

### Dispositivo con configuración diferente:
```json
{
  "id": 3,
  "name": "Power_Analyzer_03",
  "type": "Power Analyzer",
  "protocol": "RTU",
  "ip": "",
  "serialPort": "/dev/ttyUSB0",
  "baudRate": 19200,
  "parity": "Odd",
  "dataBits": 8,
  "stopBits": 2,
  "modbusId": 3,
  "startAddress": 200,
  "registers": 50
}
```
