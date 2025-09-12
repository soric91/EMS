
import time
from config.config import ConfigManager
def main():
    while True:
        time.sleep(1)
        config_manager = ConfigManager()
        print(config_manager.get_sections())
    


if __name__ == "__main__":
    main()
