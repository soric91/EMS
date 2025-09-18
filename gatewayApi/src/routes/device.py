"""
Rutas para manejo de dispositivos EMS
"""

from fastapi import APIRouter, Depends, HTTPException, status
from ..models.model import Device, DeviceResponse
from ..auth.dependencies import verify_token_only
from ..config.config import ConfigManager
import logging

# Configurar logger
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ems", tags=["Devices Add config"])


@router.post("/add/device/modbus", response_model=DeviceResponse)
async def add_device(
    device: Device,
    token: str = Depends(verify_token_only)
) -> DeviceResponse:
    """
    Endpoint para agregar o actualizar un dispositivo en la configuración.
    Requiere autenticación JWT válida.
    
    **Parámetros:**
    - **device**: Datos completos del dispositivo a agregar
    
    **Retorna:**
    - **name**: Nombre del dispositivo agregado
    - **success**: true si la operación fue exitosa
    
    **Códigos de estado:**
    - **200**: Dispositivo agregado exitosamente
    - **401**: Token inválido o no proporcionado
    - **422**: Error de validación de datos
    - **500**: Error interno del servidor
    """
    try:
        logger.info(f"Agregando dispositivo: {device.name}")

        config_manager = ConfigManager()
        # Verificar si el dispositivo ya existe
        device_exists = config_manager.device_exists(device.name)
        
        if device_exists:
            logger.info(f"Dispositivo {device.name} ya existe, actualizando configuración")
        else:
            logger.info(f"Creando nuevo dispositivo: {device.name}")
        
        # Convertir el modelo Pydantic a diccionario excluyendo el nombre
        device_data = device.model_dump(exclude={'name'})
        
        # Añadir o actualizar el dispositivo
        success = config_manager.add_device_section(device.name, device_data)
        
        if success:
            action = "actualizado" if device_exists else "agregado"
            if action == "agregado":
                config_manager.add_device_in_Modbus_list(device.name)
            logger.info(f"Dispositivo '{device.name}' {action} exitosamente")
            return DeviceResponse(name=device.name, success=True)
        else:
            logger.error(f"Error al guardar dispositivo '{device.name}'")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"Error al guardar el dispositivo {device.name}"
            )
            
    except HTTPException:
        # Re-lanzar las excepciones HTTP
        raise
    except Exception as e:
        logger.error(f"Error en add_device: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error interno del servidor: {str(e)}"
        )
