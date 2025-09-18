from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt
from src.core.config import settings
from src.util.logging import get_logger

logger = get_logger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Cifra la contraseña usando bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si la contraseña en texto plano coincide con la cifrada."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea un token de acceso JWT
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    
    try:
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        logger.debug(f"Token de acceso creado para usuario: {data.get('sub')}")
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error al crear token de acceso: {e}")
        raise

def create_refresh_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea un token de refresco JWT
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_REFRESH_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "refresh"})
    
    try:
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        logger.debug(f"Token de refresco creado para usuario: {data.get('sub')}")
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error al crear token de refresco: {e}")
        raise

def verify_token(token: str, token_type: str = "access") -> Optional[Dict[str, Any]]:
    """
    Verifica y decodifica un token JWT
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        
        # Verificar el tipo de token
        if payload.get("type") != token_type:
            logger.warning(f"Tipo de token incorrecto. Esperado: {token_type}, Recibido: {payload.get('type')}")
            return None
            
        # Verificar expiración
        exp = payload.get("exp")
        if exp is None:
            return None
            
        # Usar UTC para ambas comparaciones
        current_time = datetime.utcnow()
        expiration_time = datetime.utcfromtimestamp(exp)
        
        if current_time > expiration_time:
            logger.warning(f"Token expirado. Actual: {current_time}, Expiración: {expiration_time}")
            return None
        
        return payload
        
    except JWTError as e:
        logger.warning(f"Error al verificar token: {e}")
        return None
    except Exception as e:
        logger.error(f"Error inesperado al verificar token: {e}")
        return None

def get_user_from_token(token: str) -> Optional[str]:
    """
    Extrae el username del token JWT
    """
    payload = verify_token(token)
    if payload:
        return payload.get("sub")
    return None