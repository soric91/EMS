import os
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from fastapi import HTTPException, status
from src.core.config import settings


logger = logging.getLogger(__name__)




# Verificar que se haya configurado una clave secreta segura
if settings.JWT_SECRET_KEY == "your-super-secret-jwt-key-change-in-production":
    logger.warning("⚠️ ADVERTENCIA: Usando clave JWT por defecto. Cambie JWT_SECRET_KEY en producción!")


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea un token JWT de acceso
    
    Args:
        data: Datos a incluir en el token (payload)
        expires_delta: Tiempo de expiración personalizado (opcional)
        
    Returns:
        Token JWT firmado
    """
    try:
        to_encode = data.copy()
        
        # Configurar tiempo de expiración
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)

        # Agregar claims estándar
        to_encode.update({
            "exp": expire,
            "iat": datetime.utcnow(),  # Issued at
            "type": "access"  # Tipo de token
        })
        
        # Crear y firmar el token
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

        logger.info(f"✅ Token JWT creado para usuario: {data.get('sub', 'unknown')}")
        return encoded_jwt
        
    except Exception as e:
        logger.error(f"❌ Error creando token JWT: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al crear token"
        )


def verify_token(token: str) -> Dict[str, Any]:
    """
    Verifica y decodifica un token JWT
    
    Args:
        token: Token JWT a verificar
        
    Returns:
        Payload del token decodificado
        
    Raises:
        HTTPException: Si el token es inválido o ha expirado
    """
    try:
        # Decodificar y verificar el token
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        
        # Verificar que el token sea de tipo acceso
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Tipo de token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Verificar que tenga el claim 'sub' (username)
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: falta información del usuario",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        logger.info(f"✅ Token verificado exitosamente para usuario: {username}")
        return payload
        
    except jwt.ExpiredSignatureError:
        logger.warning("⚠️ Token JWT expirado")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        logger.error("❌ Token JWT inválido")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"❌ Error verificando token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se pudo validar las credenciales",
            headers={"WWW-Authenticate": "Bearer"},
        )


def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodifica un token sin verificar su validez (para debugging)
    
    Args:
        token: Token JWT a decodificar
        
    Returns:
        Payload del token o None si hay error
    """
    try:
        # Decodificar sin verificar (solo para propósitos de debug)
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except Exception as e:
        logger.error(f"❌ Error decodificando token: {e}")
        return None


def get_token_expiration(token: str) -> Optional[datetime]:
    """
    Obtiene la fecha de expiración de un token
    
    Args:
        token: Token JWT
        
    Returns:
        Fecha de expiración o None si hay error
    """
    try:
        payload = decode_token(token)
        if payload and "exp" in payload:
            return datetime.fromtimestamp(payload["exp"])
        return None
    except Exception as e:
        logger.error(f"❌ Error obteniendo expiración del token: {e}")
        return None


def is_token_expired(token: str) -> bool:
    """
    Verifica si un token está expirado
    
    Args:
        token: Token JWT
        
    Returns:
        True si está expirado, False en caso contrario
    """
    try:
        expiration = get_token_expiration(token)
        if expiration:
            return datetime.utcnow() > expiration
        return True  # Si no se puede obtener la expiración, considerar expirado
    except Exception:
        return True


def refresh_token(old_token: str) -> str:
    """
    Refresca un token JWT si está próximo a expirar
    
    Args:
        old_token: Token actual
        
    Returns:
        Nuevo token JWT
        
    Raises:
        HTTPException: Si no se puede refrescar el token
    """
    try:
        # Verificar token actual
        payload = verify_token(old_token)
        
        # Extraer información del usuario
        username = payload.get("sub")
        
        # Crear nuevo token con los mismos datos básicos
        new_token_data = {
            "sub": username,
            "scopes": payload.get("scopes", [])
        }
        
        new_token = create_access_token(new_token_data)
        
        logger.info(f"✅ Token refrescado para usuario: {username}")
        return new_token
        
    except Exception as e:
        logger.error(f"❌ Error refrescando token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se pudo refrescar el token"
        )


def create_reset_token(username: str, expires_minutes: int = 60) -> str:
    """
    Crea un token especial para reset de contraseña
    
    Args:
        username: Nombre de usuario
        expires_minutes: Minutos hasta la expiración
        
    Returns:
        Token JWT para reset de contraseña
    """
    try:
        expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
        
        reset_data = {
            "sub": username,
            "type": "password_reset",
            "exp": expire,
            "iat": datetime.utcnow()
        }
        
        token = jwt.encode(reset_data, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        
        logger.info(f"✅ Token de reset creado para usuario: {username}")
        return token
        
    except Exception as e:
        logger.error(f"❌ Error creando token de reset: {e}")
        raise


def verify_reset_token(token: str) -> str:
    """
    Verifica un token de reset de contraseña
    
    Args:
        token: Token de reset
        
    Returns:
        Username del token
        
    Raises:
        HTTPException: Si el token es inválido
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])

        if payload.get("type") != "password_reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token de reset inválido"
            )
        
        username = payload.get("sub")
        if not username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token de reset malformado"
            )
        
        return username
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de reset expirado"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de reset inválido"
        )
