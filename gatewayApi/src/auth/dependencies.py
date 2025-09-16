"""
Dependencias de autenticación para FastAPI
"""
from typing import Annotated, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from src.auth.security import verify_token, get_user_from_token
from src.database.dependencies import Database
from src.models.model import User, TokenData, KeysNames
from src.util.logging import get_logger

logger = get_logger(__name__)

# Configuración del esquema OAuth2
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="auth/login",
    scopes={
        "read": "Leer información",
        "write": "Escribir información", 
        "admin": "Acceso administrativo"
    }
)

async def get_current_user(
    security_scopes: SecurityScopes,
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Database
) -> User:
    """
    Obtiene el usuario actual basado en el token JWT
    """
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": authenticate_value},
    )
    
    try:
        # Verificar el token
        payload = verify_token(token, "access")
        if payload is None:
            raise credentials_exception
            
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
            
        token_scopes = payload.get("scopes", [])
        token_data = TokenData(scopes=token_scopes, username=username)
        
    except Exception as e:
        logger.error(f"Error al procesar token: {e}")
        raise credentials_exception
    
    # Verificar que el usuario existe en la base de datos
    try:
        users_collection = db[CollectionNames.USERS.value]
        user_dict = await users_collection.find_one({KeysNames.USERNAME: token_data.username})
        
        if user_dict is None:
            raise credentials_exception
            
        # Convertir a modelo User
        user_dict["id"] = str(user_dict["_id"])
        user = User(**user_dict)
        
    except Exception as e:
        logger.error(f"Error al obtener usuario de la base de datos: {e}")
        raise credentials_exception
    
    # Verificar scopes requeridos
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Permisos insuficientes",
                headers={"WWW-Authenticate": authenticate_value},
            )
    
    return user

async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Verifica que el usuario actual esté activo
    """
    # Aquí puedes agregar lógica adicional para verificar si el usuario está activo
    # Por ejemplo, verificar un campo 'is_active' en la base de datos
    return current_user

async def get_current_admin_user(
    current_user: Annotated[User, Depends(get_current_active_user)]
) -> User:
    """
    Verifica que el usuario actual sea administrador
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos de administrador"
        )
    return current_user

# Aliases para uso fácil en rutas
CurrentUser = Annotated[User, Depends(get_current_active_user)]
AdminUser = Annotated[User, Depends(get_current_admin_user)]
