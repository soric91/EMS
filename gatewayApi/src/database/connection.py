from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from src.core.config import settings
from src.util.logging import get_logger
from typing import AsyncGenerator, Annotated




logger = get_logger(__name__)

_client: AsyncIOMotorClient | None = None

async def get_database() -> AsyncIOMotorDatabase:
    """Devuelve una instancia única de la base de datos MongoDB."""
    global _client
    if _client is None:
        try:
            _client = AsyncIOMotorClient(settings.mongodb_uri)        
        except Exception as e:
            logger.error(f"Error al conectar a MongoDB: {e}")
            raise
        
    return _client[settings.MONGO_DATABASE]


async def close_connection() -> None:
    """Cierra la conexión a la base de datos MongoDB."""
    global _client
    if _client:
        _client.close()
        _client = None
    else:
        logger.warning("No hay conexión activa para cerrar.")
        



