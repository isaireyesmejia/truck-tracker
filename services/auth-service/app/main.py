from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db, engine, Base
from app.models import Usuario
from app.schemas import UsuarioCreate, UsuarioLogin, TokenResponse
from app.security import hash_password, verify_password, create_access_token

app = FastAPI(title="Auth Service")


@app.post("/registro", status_code=status.HTTP_201_CREATED)
def registrar_usuario(datos: UsuarioCreate, db: Session = Depends(get_db)):
    existente = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    nuevo_usuario = Usuario(
        email=datos.email,
        password_hash=hash_password(datos.password),
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return {"id": nuevo_usuario.id, "email": nuevo_usuario.email}


@app.post("/login", response_model=TokenResponse)
def login(datos: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == datos.email).first()

    if not usuario or not verify_password(datos.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    if not usuario.activo:
        raise HTTPException(status_code=403, detail="Usuario inactivo")

    token = create_access_token({"sub": usuario.email})
    return TokenResponse(access_token=token)


@app.get("/health")
def health():
    return {"status": "ok"}