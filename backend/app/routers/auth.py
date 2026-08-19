import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from app.database import get_db
from app.schemas.auth import LoginRequest, LoginResponse
from app.auth.jwt_handler import crear_access_token
from app.models.usuario import Usuario

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.correo_electronico == payload.email)
        .first()
    )

    password_valido = usuario and bcrypt.checkpw(
        payload.password.encode("utf-8"),
        usuario.password_hash.encode("utf-8"),
    )

    if not password_valido:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )

    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo",
        )

    usuario.fecha_ultimo_login = func.now()
    db.commit()

    token = crear_access_token(
        data={"sub": str(usuario.usuario_id), "rol_id": usuario.rol_id}
    )

    return LoginResponse(
        access_token=token,
        idUsuario=usuario.usuario_id,
        nombre=usuario.nombre,
    )