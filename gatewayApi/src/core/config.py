from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from urllib.parse import quote_plus


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
    env_file=(".env.local", ".env"),
        env_ignore_empty=True,
        extra="ignore",
    )

    # API Configuration
    API_PORT: int = 8000
    API_HOST: str = "0.0.0.0"

    # MongoDB Configuration
    MONGO_DATABASE: str = "ems_db"  
    MONGO_USERNAME: str = "admin"
    MONGO_PASSWORD: str = "admin123"
    MONGO_HOST: str = "database_ems"
    MONGO_PORT: int = 27017
    
    # JWT Configuration
    JWT_SECRET_KEY: str = "your_secret_key"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    JWT_REFRESH_TOKEN_EXPIRE_MINUTES: int = 1440  
    
    # Admin User (for initialization)
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"
    IS_ADMIN: bool = False
    EMAIL_ADMIN: str = "admin@example.com"

    api_port : int = 8008
    
    
    @property
    def mongodb_uri(self) -> str:
        """Construye la URI de conexión a MongoDB"""
        username = quote_plus(self.MONGO_USERNAME)
        password = quote_plus(self.MONGO_PASSWORD)
        return f"mongodb://{username}:{password}@{self.MONGO_HOST}:{self.MONGO_PORT}/{self.MONGO_DATABASE}?authSource=admin"

# Carga .env y luego .env.local para que este último pueda sobreescribir valores
load_dotenv(".env")
load_dotenv(".env.local")

settings = Settings()