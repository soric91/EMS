import configparser
from dataclasses import dataclass, field
from pathlib import Path

@dataclass
class ConfigManager:
    config_file: str = "config.ini"
    config: configparser.ConfigParser = field(default_factory=configparser.ConfigParser)

    def __post_init__(self):
        self.__load_config()
        self.device_name= "DEVICE_"

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
    
    def add_device_section(self, device_name: str, device_data: dict) -> bool:
        """Añade o actualiza una sección de dispositivo en el archivo de configuración"""
        try:
            # Crear la sección si no existe
            name_device = f"DEVICE_{device_name}"
            if not self.config.has_section(name_device):
                self.config.add_section(name_device)
            
            # Agregar todos los datos del dispositivo
            for key, value in device_data.items():
                self.config.set(name_device, key, str(value))
            
            # Guardar cambios en el archivo
            self._save_config()
            return True
        except Exception as e:
            print(f"Error al agregar dispositivo {device_name}: {e}")
            return False
    
    def remove_device_section(self, device_name: str) -> bool:
        """Elimina una sección de dispositivo del archivo de configuración"""
        try:
            if self.config.has_section(device_name):
                self.config.remove_section(device_name)
                self._save_config()
                return True
            return False
        except Exception as e:
            print(f"Error al eliminar dispositivo {device_name}: {e}")
            return False
    
    def device_exists(self, device_name: str) -> bool:
        """Verifica si un dispositivo existe en la configuración"""
        return self.config.has_section(device_name)
    
    
        
    
    def _save_config(self):
        """Guarda la configuración actual en el archivo"""
        current_dir = Path(__file__).parent
        config_path = (current_dir / self.config_file).resolve()
        
        with open(config_path, 'w') as configfile:
            self.config.write(configfile)
        

configManager = ConfigManager()