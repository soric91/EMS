from typing import Dict, Optional
from datetime import timedelta
from src.models.model import CollectionNames, UserLoginResponse, User, KeysNames
from src.repositories.repository import get_document_by_dict, insert_data
from src.util.logging import get_logger
from src.auth.security import hash_password, verify_password, create_access_token, create_refresh_token
from src.core.config import settings

logger = get_logger(__name__)



async def create_user(user_data: Dict) -> User | None:
    """Crea un nuevo usuario en la base de datos."""
    try:
        
        if await get_document_by_dict({KeysNames.USERNAME: user_data[KeysNames.USERNAME]}, CollectionNames.USERS.value):
            return None
        
        # Hash de la contraseña antes de guardar
        if KeysNames.PASSWORD in user_data:
            user_data[KeysNames.PASSWORD] = hash_password(user_data[KeysNames.PASSWORD])

        result_id = await insert_data(collection=CollectionNames.USERS.value, data=user_data)
        if result_id:
            user_data["_id"] = str(result_id)
            # Remover la contraseña del objeto retornado
            user_data.pop(KeysNames.PASSWORD, None)
            logger.info(f"Usuario {user_data.get(KeysNames.USERNAME, 'N/A')} creado con ID: {result_id}")
            return User(**user_data)
        
    except Exception as e:
        logger.error(f"Error al crear el usuario: {e}")
    return None



async def authenticate_user(credentials: Dict) -> UserLoginResponse | None:
    """
    Autentica a un usuario y genera tokens JWT
    """
    try:
        # Buscar usuario en la base de datos
        user_indb = await get_document_by_dict(data={KeysNames.USERNAME: credentials[KeysNames.USERNAME]}, collection=CollectionNames.USERS.value)

        if not user_indb:
            logger.warning(f"Usuario no encontrado: {credentials[KeysNames.USERNAME]}")
            return None
        
        # Verificar contraseña
        if not verify_password(credentials[KeysNames.PASSWORD], user_indb[KeysNames.PASSWORD]):
            logger.warning(f"Contraseña incorrecta para usuario: {credentials[KeysNames.USERNAME]}")
            return None
        
        # Determinar scopes basado en los permisos del usuario
        scopes = ["read"]
        if user_indb.get(KeysNames.IS_ADMIN, False):
            scopes.extend(["write", "admin"])
        else:
            scopes.append("write")

        user_indb["_id"] = str(user_indb["_id"])
        # Crear payload para los tokens
        token_data = {
            "sub": user_indb[KeysNames.USERNAME],
            "scopes": scopes,
            "user_id": user_indb["_id"]
        }
        
        # Generar tokens
        access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_token_expires = timedelta(minutes=settings.JWT_REFRESH_TOKEN_EXPIRE_MINUTES)
        
        access_token = create_access_token(
            data=token_data, 
            expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(
            data=token_data,
            expires_delta=refresh_token_expires
        )
        
        # Crear objeto User sin contraseña
        user_data = user_indb.copy()
        user_data.pop(KeysNames.PASSWORD, None)  # Remover contraseña
        user = User(**user_data)
        
        # Crear respuesta
        login_response = UserLoginResponse(
            access_token=access_token,
            token_type="bearer",
            refresh_token=refresh_token,
            expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES,
            user=user
        )
        
        return login_response
        
    except Exception as e:
        logger.error(f"Error al autenticar al usuario: {e}")
    return None

async def refresh_access_token(refresh_token: str) -> Dict | None:
    """
    Genera un nuevo access token usando el refresh token
    """
    try:
        from src.auth.security import verify_token
        
        # Verificar refresh token
        payload = verify_token(refresh_token, "refresh")
        if not payload:
            return None
        
        username = payload.get("sub")
        scopes = payload.get("scopes", [])
        user_id = payload.get("user_id")
        
        # Verificar que el usuario aún existe
        user_data = await get_document_by_dict({KeysNames.USERNAME: username}, CollectionNames.USERS.value)
        if not user_data:
            return None
        
        # Generar nuevo access token
        token_data = {
            "sub": username,
            "scopes": scopes,
            "user_id": user_id
        }
        
        access_token_expires = timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        new_access_token = create_access_token(
            data=token_data,
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": new_access_token,
            "token_type": "bearer",
            "expires_in": settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        }
        
    except Exception as e:
        logger.error(f"Error al refrescar token: {e}")
    return None

# Función de factory para crear el repositorio con dependencias
# async def get_user_repository(db: Database) -> UserRepository:
#     """Factory function para crear el repositorio de usuario"""
#     return UserRepository(db)