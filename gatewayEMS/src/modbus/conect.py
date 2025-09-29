
from typing import Any, Dict
from src.Config.config import ConfigManager
from src.Comunication.modbus import ModbusClientFactory
from src.Config.devicemap import load_device_map, get_register_values
from src.Model.model import NameParamsModbus
from src.Utils.util import is_list_of_lists
from src.Config.logs import logger

async def get_modbus_clients() -> Dict[str, Dict[str, Any]]:
    """
    Configura y retorna un diccionario con los clientes Modbus listos para usar.
    """
    try:
        config_manager = ConfigManager("src/Comunication/modbus.ini") 
        device_config = config_manager.get_device_config()
        logger.info(f"Dispositivos detectados: {list(device_config.keys())}")

        modbus_client_factory = ModbusClientFactory(device_config)
        clients = await modbus_client_factory.start_connection()
        logger.info(f"Clientes configurados exitosamente: {list(clients.keys())}")

        # ✅ Ahora debes recorrer por port y luego por cada device
        for port, client_info in clients.items():
            logger.info(f"Procesando mapa de registros para dispositivos conectados a: {port}")

            for device in client_info["devices"]:
                logger.info(f"Procesando mapa de registros para: {device['name']}")

                datos_map = load_device_map(device[NameParamsModbus.modbus_map_path])
                datos_factorizado = get_register_values(datos_map)

                if not is_list_of_lists(datos_factorizado):
                    device[NameParamsModbus.list_address_init.value] = datos_factorizado[0]
                    device[NameParamsModbus.list_count_address.value] = datos_factorizado[1]
                    device[NameParamsModbus.modbus_map.value] = datos_map

                    # Eliminar el path ya que ya cargamos el mapa
                    device.pop(NameParamsModbus.modbus_map_path, None)

                logger.info(f"Mapa de registros cargado correctamente para {device['name']}")

        logger.info("✅ Todos los clientes y dispositivos fueron configurados correctamente.")
        return clients

    except Exception as e:
        logger.exception("❌ Error durante la configuración de los clientes Modbus.")
        return {}