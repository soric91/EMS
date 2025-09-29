from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from urllib.parse import quote_plus


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
    env_file=(".env.local", ".env"),
        env_ignore_empty=True,
        extra="ignore",
    )

    path_command: str = "src/config/command.json"
    max_workers: int = 5
    
    
    

# Carga .env y luego .env.local para que este último pueda sobreescribir valores
load_dotenv(".env")
load_dotenv(".env.local")

settings = Settings()