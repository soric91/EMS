import asyncio
from src.util.logging import get_logger
from src.core.config import settings
from src.services.service import create_user
from src.database.connection import close_connection
from src.models.model import KeysNames
import sys
logger = get_logger(__name__)

async def init_admin():
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

    created_user = await create_user(user_data)
    if created_user:
        logger.info(f"Usuario admin creado exitosamente: {created_user.username}")

    await close_connection()
if __name__ == "__main__":
    asyncio.run(init_admin())
    sys.exit(0) 
