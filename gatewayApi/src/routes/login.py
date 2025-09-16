"""
Rutas de autenticación para el sistema EMS
"""
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from src.models.model import UserLogin, UserLoginResponse, KeysNames
from src.services.service import authenticate_user
from src.util.logging import get_logger

logger = get_logger(__name__)

# Crear el router
router = APIRouter(prefix="/api/ems", tags=["Authentication"])


@router.post(
    "/login",
    response_model=UserLoginResponse,
    status_code=status.HTTP_200_OK,
    summary="Autenticar usuario",
    description="Autentica un usuario con credenciales username/password y retorna tokens JWT"
)
async def login_user(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> UserLoginResponse:
    """
    Endpoint para autenticar usuarios en el sistema EMS.
    
    **Parámetros:**
    - **username**: Nombre de usuario
    - **password**: Contraseña del usuario
    
    **Retorna:**
    - **access_token**: Token JWT de acceso
    - **token_type**: Tipo de token (bearer)
    - **refresh_token**: Token JWT de refresco
    - **expires_in**: Tiempo de expiración en minutos
    - **user**: Información del usuario autenticado
    
    **Códigos de estado:**
    - **200**: Autenticación exitosa
    - **401**: Credenciales inválidas
    - **422**: Error de validación de datos
    - **500**: Error interno del servidor
    """
    try:
        # Preparar las credenciales para el servicio
        credentials = {
            KeysNames.USERNAME: form_data.username,
            KeysNames.PASSWORD: form_data.password
        }
        
        # Intentar autenticar al usuario
        login_response = await authenticate_user(credentials)
        
        if not login_response:
            logger.warning(f"Intento de login fallido para usuario: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        logger.info(f"Usuario autenticado exitosamente: {form_data.username}")
        return login_response
        
    except HTTPException:
        # Re-raise HTTPException para mantener el código de estado
        raise
    except Exception as e:
        logger.error(f"Error interno durante la autenticación: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor durante la autenticación"
        )


@router.post(
    "/refresh",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Refrescar token de acceso",
    description="Genera un nuevo access token usando el refresh token"
)
async def refresh_token_endpoint(
    refresh_token: str
) -> dict:
    """
    Endpoint para refrescar el token de acceso.
    
    **Parámetros:**
    - **refresh_token**: Token de refresco válido
    
    **Retorna:**
    - **access_token**: Nuevo token JWT de acceso
    - **token_type**: Tipo de token (bearer)
    - **expires_in**: Tiempo de expiración en minutos
    
    **Códigos de estado:**
    - **200**: Token refrescado exitosamente
    - **401**: Token de refresco inválido o expirado
    - **500**: Error interno del servidor
    """
    try:
        from src.services.service import refresh_access_token
        
        new_token_data = await refresh_access_token(refresh_token)
        
        if not new_token_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de refresco inválido o expirado",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return new_token_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al refrescar token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al refrescar token"
        )
