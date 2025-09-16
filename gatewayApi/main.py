
from src.util.logging import get_logger
from src.core.config import settings
from src.services.service import create_user, authenticate_user
from src.models.model import KeysNames
import asyncio
import time
import uvicorn
logger = get_logger(__name__)

def main():
    uvicorn.run("src.app:app", host=settings.API_HOST, port=settings.API_PORT)

if __name__ == "__main__":
    main()
