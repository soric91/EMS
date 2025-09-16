
from src.util.logging import get_logger
from src.core.config import settings
from src.repositories.user_repository import create_user
from src.models.model import KeysNames
import asyncio
logger = get_logger(__name__)

async def main():
    logger.info("Gateway API is starting...")

    try:
        
        username = settings.ADMIN_USERNAME or "admin"
        password = settings.ADMIN_PASSWORD or "admin123"
        is_admin = settings.IS_ADMIN or False
        email_admin = settings.EMAIL_ADMIN or "admin@example.com"

        user_data = {
            KeysNames.USERNAME: username,
            KeysNames.PASSWORD: password,
            KeysNames.IS_ADMIN: is_admin,
            KeysNames.EMAIL: email_admin
        }

        # Crear usuario admin
        created_user = await create_user(user_data)
        if created_user:
            logger.info(f"Usuario creado exitosamente: {created_user.username}")
        else:
            logger.warning("No se pudo crear el usuario.")

    except Exception as e:
        logger.error(f"Error al iniciar la API: {e}")

    except Exception as e:
        logger.error(f"Error al conectar a la base de datos: {e}")



if __name__ == "__main__":
    asyncio.run(main())
