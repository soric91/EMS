import logging
from logging.handlers import RotatingFileHandler
from src.core.config import settings
from src.config.config import configManager

def _setup_logging() -> None:
        try:
            loglevel = configManager.config["DEFAULT"].get("loglevel", "INFO")
            logstdout = configManager.config["DEFAULT"].getboolean("logstdout", False)
            logfile = configManager.config["DEFAULT"].get("logfile", None)
            max_size_bytes = configManager.config["DEFAULT"].getint("max_size_bytes", 1485760)
            backup_count = configManager.config["DEFAULT"].getint("backup_count", 2)

            level = getattr(logging, loglevel.upper(), logging.WARN)

            handlers = []

            if logfile:
                handlers.append(
                    RotatingFileHandler(
                        logfile, maxBytes=max_size_bytes, backupCount=backup_count
                    )
                )

            if logstdout:
                handlers.append(logging.StreamHandler())

            logging.basicConfig(
                level=level,
                format="%(asctime)s - %(module)s - %(levelname)s - %(message)s",
                handlers=handlers,
            )

            if configManager.config["DEFAULT"].getboolean("sampleslog", False):
                logging.getLogger(__name__).info("Samples log is enabled.")
        except Exception as e:
            print(f"Failed to configure logging: {e}")

def get_logger(name: str = None) -> logging.Logger:
    """
    Obtiene un logger con el nombre especificado.
    Si no se proporciona nombre, usa el nombre del módulo que llama.
    """
    if name is None:
        import inspect
        frame = inspect.currentframe().f_back
        name = frame.f_globals.get('__name__', 'unknown')
    
    return logging.getLogger(name)
