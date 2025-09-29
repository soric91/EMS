import asyncio
from dataclasses import dataclass, field
from typing import Any, Dict, Union
from pymodbus.client import AsyncModbusSerialClient, AsyncModbusTcpClient
from src.Model.model import NameParamsModbus, ProtocolCom
from src.Config.logs import logger

@dataclass
class ModbusClientFactory:
    """
    Dataclass for creating and managing Modbus clients agrupados por puerto/IP.
    """
    config_dict: Dict[str, Dict[str, Any]]
    clients: Dict[str, Dict[str, Any]] = field(init=False, default_factory=dict)

    async def start_connection(self) -> Dict[str, Dict[str, Any]]:
        """
        Agrupa y conecta clientes Modbus por puerto/IP.

        :return: Diccionario { puerto/IP : { client: ..., devices: [...] } }
        """
        self.clients = {}

        for device_name, device_config in self.config_dict.items():
            protocol = device_config.get(NameParamsModbus.protocol)

            # Determinar la clave del cliente (port o host)
            client_key = device_config.get(NameParamsModbus.serial_port) if protocol == ProtocolCom.RTU else device_config.get(NameParamsModbus.host)

            if not client_key:
                logger.warning(f"Dispositivo {device_name} sin puerto o IP válido.")
                continue

            try:
                # Si no existe el cliente aún, crearlo
                if client_key not in self.clients:
                    if protocol == ProtocolCom.RTU:
                        client = AsyncModbusSerialClient(
                            port=client_key,
                            baudrate=device_config.get(NameParamsModbus.baudrate),
                        )
                    elif protocol == ProtocolCom.TCP:
                        client = AsyncModbusTcpClient(
                            host=client_key,
                            port=device_config.get(NameParamsModbus.port),
                        )
                    else:
                        logger.warning(f"Protocolo no mapeado para {device_name}")
                        continue

                    await client.connect()
                    if not client.connected:
                        logger.error(f"Cliente {client_key} no pudo conectarse.")
                        await self.__end_connection(client)
                        continue

                    self.clients[client_key] = {
                        "client": client,
                        "devices": []
                    }
                    logger.info(f"Cliente creado y conectado para {client_key}")

                # Registrar dispositivo al cliente ya existente
                self.clients[client_key]["devices"].append({
                    "name": device_name,
                    "slave": device_config.get(NameParamsModbus.slave_id),
                    "modbus_function": device_config.get(NameParamsModbus.modbus_function),
                    "modbus_map_path": device_config.get(NameParamsModbus.modbus_map_path),
                })
                logger.info(f"Dispositivo {device_name} agregado al cliente {client_key}")

            except (asyncio.TimeoutError, AssertionError) as e:
                logger.error(f"Error de conexión con {device_name}: {e}")
            except Exception as e:
                logger.exception(f"Error inesperado con {device_name}: {e}")

        return self.clients  

    async def __end_connection(self, client):
        """Cierra conexión del cliente"""
        if client:
            try:
                await client.close()
                logger.info("Conexión cerrada correctamente")
            except Exception as e:
                logger.error(f"No se pudo cerrar la conexión: {e}")