import configparser
from dataclasses import dataclass, field
from pathlib import Path

@dataclass
class ConfigManager:
    config_file: str = '../../src/config/config.ini'
    config: configparser.ConfigParser = field(default_factory=configparser.ConfigParser)

    def __post_init__(self):
        self.__load_config()

    def __load_config(self):
        # Resolver la ruta absoluta desde el directorio actual del módulo
        current_dir = Path(__file__).parent
        config_path = (current_dir / self.config_file).resolve()
        
        if not config_path.exists():
            print(f"Archivo de configuración no encontrado en: {config_path}")
            self.__create_default_config(config_path)
        
        self.config.read(config_path)
    

    def __create_default_config(self, path: Path):
        """Crea un archivo de configuración por defecto si no existe"""
        path.parent.mkdir(parents=True, exist_ok=True)
        
        # Configuración por defecto
        self.config['DEFAULT'] = {
            'loglevel': 'INFO',
            'logstdout': 'True',
            'logfile': 'src/util/gateway_ems.log',
            'max_size_bytes': '1485760',
            'backup_count': '5'
        }
        

        with open(path, 'w') as configfile:
            self.config.write(configfile)

    def get_sections(self) -> list:
        """Obtiene todas las secciones del archivo de configuración"""
        return self.config.sections()
    
    def get_value(self, section: str, key: str, fallback=None):
        """Obtiene un valor específico de una sección"""
        return self.config.get(section, key, fallback=fallback)
    
    def get_section_dict(self, section: str) -> dict:
        """Obtiene todos los valores de una sección como diccionario"""
        if section in self.config:
            return dict(self.config[section])
        return {}
        

configManager = ConfigManager()