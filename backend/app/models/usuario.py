from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func

from app.database import Base


class Usuario(Base):
    __tablename__ = "Usuarios"
    __table_args__ = {"schema": "dbo"}

    usuario_id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    correo_electronico = Column(String(150), unique=True, nullable=False, index=True)
    telefono = Column(String(20), nullable=True)
    fecha_registro = Column(DateTime, server_default=func.now())
    activo = Column(Boolean, default=True)
    rol_id = Column(Integer, nullable=True)  # sin FK por ahora, se agrega cuando trabajemos roles
    password_hash = Column(String(255), nullable=False)
    fecha_ultimo_login = Column(DateTime, nullable=True)