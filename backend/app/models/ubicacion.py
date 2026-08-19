from sqlalchemy import Column, Integer, DateTime, Numeric
from app.database import Base


class Ubicacion(Base):
    __tablename__ = "Ubicaciones"
    __table_args__ = {"schema": "dbo"}

    Id = Column(Integer, primary_key=True, index=True)
    CamionID = Column(Integer, nullable=False)
    FechaHora = Column(DateTime, nullable=False)
    Latitud = Column(Numeric(9, 6), nullable=False)
    Longitud = Column(Numeric(9, 6), nullable=False)
    Velocidad = Column(Numeric(5, 2), nullable=True)
    # Coordenada (geography) se llena vía SQL crudo en el INSERT, no se mapea aquí