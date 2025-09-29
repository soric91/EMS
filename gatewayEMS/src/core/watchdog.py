import asyncio
import json
from src.utils.logging import get_logger
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from src.core.config import settings
import threading

logger = get_logger(__name__)

class BaseWatchdog(FileSystemEventHandler):
    """
    Clase base para monitorear cambios en command.json
    Maneja múltiples variables y ejecución continua
    """
    
    connect = None      # La clase hija debe definir esto
    readstart = None    # La clase hija debe definir esto
    
    def __init__(self):
        if not self.connect:
            raise ValueError("La clase hija debe definir 'connect'")
        if not self.readstart:
            raise ValueError("La clase hija debe definir 'readstart'")
            
        self.file_path = Path(settings.path_command).resolve()
        self.observer = Observer()
        self.executor = ThreadPoolExecutor(max_workers=2)
        
        # Configurar event loop async en hilo separado
        self._async_loop = self._setup_async_environment()
        
        # Estados para detección de cambios
        self.prev_connect_value = None
        self.prev_readstart_value = None
        self.result_future = None
    
    def start(self):
        """Inicia el monitoreo de archivos"""
        try:
            # Configurar observer
            self.observer.schedule(self, str(self.file_path.parent), recursive=False)
            self.observer.start()
            logger.info(f"Watchdog iniciado para {self.file_path}")
            
            # Ejecutar verificación inicial
            self._check_variables_and_execute()
            
        except Exception as e:
            logger.error(f"Error iniciando watchdog: {e}")
            raise
    
    def stop(self):
        """Detiene el monitoreo de forma elegante"""
        try:
            # Detener observer
            if self.observer.is_alive():
                self.observer.stop()
                self.observer.join()
            
            # Detener executor
            self.executor.shutdown(wait=True)
            
            # Detener async loop si existe
            if hasattr(self, '_async_loop') and not self._async_loop.is_closed():
                self._async_loop.call_soon_threadsafe(self._async_loop.stop)
            
            logger.info("Watchdog detenido correctamente")
            
        except Exception as e:
            logger.error(f"Error deteniendo watchdog: {e}")
    
    def on_modified(self, event):
        """Se ejecuta cuando el archivo JSON cambia"""
        if event.src_path == str(self.file_path):
            logger.info("Archivo JSON modificado, verificando variables...")
            self._check_variables_and_execute()
    
    def _check_variables_and_execute(self):
        """Verifica las variables del JSON y ejecuta tareas si es necesario"""
        try:
            # Leer valores actuales del JSON
            with open(self.file_path, 'r') as file:
                json_data = json.load(file)
            
            connect_value = json_data.get(self.connect, False)
            readstart_value = json_data.get(self.readstart, False)
            
            # Detectar cambios
            connect_changed = connect_value != self.prev_connect_value
            readstart_changed = readstart_value != self.prev_readstart_value
            
            if connect_changed or readstart_changed:
                logger.info(f"Cambio detectado - {self.connect}: {connect_value}, {self.readstart}: {readstart_value}")
                
                # Actualizar estados anteriores
                self.prev_connect_value = connect_value
                self.prev_readstart_value = readstart_value
                
                # Ejecutar main_loop en un hilo separado
                future = self.executor.submit(
                    self._run_async_main_loop, 
                    connect_value, 
                    readstart_value
                )
                
                # Opcional: manejar resultado
                future.add_done_callback(self._task_completed)
                self.result_future = future
            
        except json.JSONDecodeError as e:
            logger.error(f"Error leyendo JSON: {e}")
        except Exception as e:
            logger.error(f"Error verificando variables: {e}")
        
    def _setup_async_environment(self):
        """Configura el entorno async de manera elegante"""
        loop = asyncio.new_event_loop()
        thread = threading.Thread(
            target=lambda: (asyncio.set_event_loop(loop), loop.run_forever()),
            daemon=True,
            name="WatchdogAsyncLoop"
        )
        thread.start()
        return loop

    def _run_async_main_loop(self, connect_value, readstart_value):
        """Ejecuta main_loop en el entorno async configurado"""
        try:
            future = asyncio.run_coroutine_threadsafe(
                self.main_loop(connect_value, readstart_value),
                self._async_loop
            )
            return future.result(timeout=30)  # Timeout de seguridad
        except Exception as e:
            logger.error(f"Error ejecutando main_loop: {e}")
            return None

    
    def _task_completed(self, future):
        """Callback cuando se completa una tarea"""
        try:
            result = future.result()
            if result:
                logger.info(f"Tarea completada: {result}")
        except Exception as e:
            logger.error(f"Error en tarea completada: {e}")
    
    async def main_loop(self, connect_value: bool, readstart_value: bool):
        """
        Método que deben implementar las clases hijas
        Se ejecuta cada vez que hay un cambio en las variables
        """
        raise NotImplementedError("La clase hija debe implementar main_loop")