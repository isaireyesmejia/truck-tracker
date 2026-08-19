from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class UbicacionCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    camion_id: int = Field(..., alias="idVehiculo")
    latitud: float = Field(..., ge=-90, le=90)
    longitud: float = Field(..., ge=-180, le=180)
    velocidad: float | None = None
    timestamp: datetime


class UbicacionResponse(BaseModel):
    success: bool
    id: int


class UbicacionOut(BaseModel):
    """
    Contrato de salida de la API (snake_case, sin alias).
    El mapeo desde las columnas de SQL Server (PascalCase) se hace
    explícitamente en from_row(), no vía alias — así el nombre de
    columna en la BD puede cambiar sin afectar el contrato público.
    """
    id: int
    camion_id: int
    fecha_hora: datetime
    latitud: float
    longitud: float
    velocidad: float | None = None

    @classmethod
    def from_row(cls, row) -> "UbicacionOut":
        return cls(
            id=row["id"],
            camion_id=row["CamionID"],
            fecha_hora=row["FechaHora"],
            latitud=row["Latitud"],
            longitud=row["Longitud"],
            velocidad=row["Velocidad"],
        )