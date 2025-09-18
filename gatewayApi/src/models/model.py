from enum import Enum
from pydantic import BaseModel, Field, EmailStr, field_serializer
from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId


class User(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    username: str = Field(..., min_length=3, description="Nombre de usuario")
    email: Optional[EmailStr] = Field(default=None, index=True)
    is_admin: bool = Field(default=False, description="Indica si el usuario es administrador")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Fecha de creación del usuario")
    updated_at: Optional[datetime] = Field(default=None, description="Fecha de última actualización del usuario")
    
    model_config = {
        "arbitrary_types_allowed": True,
        "populate_by_name": True,
        "from_attributes": True,
    }
    
    @field_serializer('id')
    def serialize_id(self, id: Optional[str]):
        if id is None:
            return None
        return str(id)


class UserInDB(User):
    """Modelo para usuario almacenado en la base de datos (incluye contraseña)"""
    password: str = Field(..., description="Contraseña hasheada", alias="hashed_password")


# Modelos de autenticación
class UserLogin(BaseModel):
    """Modelo para login de usuario"""
    username: str = Field(..., min_length=3, description="Nombre de usuario")
    password: str = Field(..., min_length=5, description="Contraseña")


class UserLoginResponse(BaseModel):
    """Respuesta exitosa de login"""
    access_token: str = Field(..., description="Token de acceso JWT")
    token_type: str = Field(default="bearer", description="Tipo de token")
    refresh_token: Optional[str] = Field(None, description="Token de refresco JWT")
    expires_in: int = Field(..., description="Tiempo en minutos para que el token expire")
    user: User = Field(..., description="Información del usuario autenticado")


class TokenData(BaseModel):
    """Datos contenidos en el token JWT"""
    username: Optional[str] = None
    scopes: list[str] = []


class CollectionNames(str, Enum):
    """Nombres de las colecciones en MongoDB"""
    USERS = "users"
    LOGS = "logs"
    
    def __str__(self) -> str:
        return str(self.value)


class KeysNames(str, Enum):
    """Nombres de las claves en los documentos"""
    USERNAME = "username"
    EMAIL = "email"
    PASSWORD = "password"
    IS_ADMIN = "is_admin"
    CREATED_AT = "created_at"
    UPDATED_AT = "updated_at"
    NAME = "name"
    
    def __str__(self) -> str:
        return str(self.value)


# Modelo para dispositivo EMS
class Device(BaseModel):
    """Modelo para datos de dispositivo EMS"""
    id: int = Field(..., description="ID único del dispositivo")
    deviceName: str = Field(..., min_length=1, description="Nombre del dispositivo")
    deviceType: str = Field(..., description="Tipo de dispositivo (ej: CT Meter)")
    protocol: str = Field(..., description="Protocolo de comunicación (ej: RTU)")
    ipAddress: Optional[str] = Field(default="", description="Dirección IP del dispositivo")
    port: Optional[int] = Field(default="", description="Puerto del dispositivo")
    serialPort: Optional[str] = Field(default="", description="Puerto serie (ej: /dev/ttyRS485)")
    baudRate: Optional[int] = Field(default=9600, description="Velocidad de baudios")
    parity: Optional[str] = Field(default="N", description="Paridad (None, Even, Odd)")
    dataBits: Optional[int] = Field(default=8, description="Bits de datos")
    stopBits: Optional[int] = Field(default=1, description="Bits de parada")
    modbusId: int = Field(..., description="ID Modbus del dispositivo")
    startAddress: int = Field(..., description="Dirección inicial de registros")
    registers: int = Field(..., description="Número de registros a leer")


class DeviceResponse(BaseModel):
    """Respuesta para operaciones con dispositivos"""
    deviceName: str = Field(..., description="Nombre del dispositivo")
    success: bool = Field(default=True, description="Indica si la operación fue exitosa")