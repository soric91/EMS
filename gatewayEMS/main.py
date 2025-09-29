import asyncio
import time
from src.core.config import settings
from src.core.watchdog import BaseWatchdog

class PrintTaskWatchdog(BaseWatchdog):
    connect = "ModbusConnect" 
    readstart = "ModbusStartRead"
    
    def __init__(self):
        super().__init__()
        # Parámetros internos
        self.is_connected = False
        self.read_task = None
    
    async def main_loop(self, connect_value: bool = False, readstart_value: bool = False):
        print(f"🔄 main_loop ejecutado - Connect: {connect_value}, ReadStart: {readstart_value}")
        
        # Manejar conexión/desconexión
        if connect_value and not self.is_connected:
            await self.task_connect()
        elif not connect_value and self.is_connected:
            await self.task_disconnect()
            self.is_connected = False
            
        # Manejar lectura solo si está conectado
        if self.is_connected:
            if readstart_value and self.read_task is None:
                print("🚀 Iniciando tarea de lectura...")
                self.read_task = asyncio.create_task(self.task_Read())
            elif not readstart_value and self.read_task is not None:
                print("🛑 Deteniendo tarea de lectura...")
                await self._stop_read_task()
        elif not self.is_connected and self.read_task is not None:
            # Si se desconecta, también detener lectura
            await self._stop_read_task()
    
    async def _stop_read_task(self):
        """Método auxiliar para detener la tarea de lectura limpiamente"""
        if self.read_task is not None:
            self.read_task.cancel()
            try:
                await self.read_task
            except asyncio.CancelledError:
                print("✅ Tarea de lectura cancelada correctamente")
            finally:
                self.read_task = None

    async def task_connect(self):
        self.is_connected = True
        print("🔌 Conectado a Modbus.")
        
    async def task_Read(self):
        print("📖 Iniciando lectura de Modbus...")
        try:
            count = 0
            while True:
                # connect_val, readstart_val = self._get_current_json_values()
                # if not connect_val or not readstart_val:
                #     print("🛑 Variables cambiaron, deteniendo lectura...")
                #     break
                count += 1
                print(f"🖨️ Print #{count} - {time.strftime('%H:%M:%S')} - Leyendo datos Modbus...")
                await asyncio.sleep(1)
        except asyncio.CancelledError:
            print("❌ Tarea de lectura cancelada.")
            raise
            
    async def task_disconnect(self):
        print("🔌 Desconectando de Modbus...")
        await self._stop_read_task()
        print("❌ Desconectado de Modbus.")

def main():
    print("🚀 Iniciando Gateway EMS con Print Task...")
    print(f"📁 Monitoreando: {settings.path_command}")
    
    # Crear watchdog
    wd = PrintTaskWatchdog()
    wd.start()
    
    print("🔍 Watchdog iniciado!")
    print(f"👁️  Monitoreando variables: '{wd.connect}' y '{wd.readstart}'")
    print("\n📋 Instrucciones:")
    print("1. Cambia 'ModbusConnect' a true para CONECTAR")
    print("2. Cambia 'ModbusStartRead' a true para INICIAR los prints")
    print("3. Cambia 'ModbusStartRead' a false para DETENER los prints")
    print("future", wd.result_future)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Deteniendo watchdog...")
        wd.stop()
        print("👋 ¡Hasta luego!")

if __name__ == "__main__":
    main()