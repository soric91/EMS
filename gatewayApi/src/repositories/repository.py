from typing import Dict, Any
from src.database.connection import get_database, close_connection
from src.util.logging import get_logger
from bson import ObjectId

logger = get_logger(__name__)

async def get_document_by_dict(data: Dict[str, str] , collection: str) -> Dict[str, Any] | None:
    """Obtiene un usuario por su nombre de usuario"""

    try:
        Database = await get_database()
        match_data = await Database[collection].find_one(data)
        if match_data:
            return match_data

    except Exception as e:
        logger.error(f"Error al obtener el usuario por nombre de usuario: {e}")
    finally:
        await close_connection()

    return None


async def insert_data(data: Dict, collection: str) -> ObjectId | None:
    try:
        Database = await get_database()
        result = await Database[collection].insert_one(data)
        return result.inserted_id
    
    except Exception as e:
        logger.error(f"Error al crear el usuario: {e}")
    finally:
        await close_connection()
    return None