import configparser
from dataclasses import dataclass, field
from pathlib import Path

@dataclass
class ConfigManager:
    config_file: str = '/gatewayEMS/config/config.ini'
    config: configparser.ConfigParser = field(default_factory=configparser.ConfigParser)

    def __post_init__(self):
        self.__load_config()


    def __load_config(self):
        path = Path(self.config_file)

        if not path.exists():
            self.__create_file(path)

        self.config.read(path)

    def __create_file(self, path: Path):

        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, 'w') as configfile:
            self.config.write(configfile)


    def get_sections(self) -> list:
        return self.config.sections()
        
