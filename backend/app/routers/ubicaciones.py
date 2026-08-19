from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db
from app.schemas.ubicacion import UbicacionCreate, UbicacionResponse, UbicacionOut
from app.auth.dependencies import get_usuario_actual
from app.models.usuario import Usuario

router = APIRouter(prefix="/api", tags=["ubicaciones"])


@router.post("/registrarUbicacion", response_model=UbicacionResponse)
def registrar_ubicacion(
    payload: UbicacionCreate,
    usuario: Usuario = Depends(get_usuario_actual),
    db: Session = Depends(get_db),
):
    query = text("""
        INSERT INTO dbo.Ubicaciones
            (CamionID, FechaHora, Latitud, Longitud, Velocidad)
        OUTPUT INSERTED.Id
        VALUES
            (:camion_id, :fecha_hora, :latitud, :longitud, :velocidad)
    """)

    try:
        result = db.execute(query, {
            "camion_id": payload.camion_id,
            "fecha_hora": payload.timestamp,
            "latitud": payload.latitud,
            "longitud": payload.longitud,
            "velocidad": payload.velocidad,
        })
        nuevo_id = result.scalar()
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al guardar ubicación: {str(e)}")

    return UbicacionResponse(success=True, id=nuevo_id)


@router.get("/ubicaciones/ultima/{camion_id}", response_model=UbicacionOut)
def obtener_ultima_ubicacion(
    camion_id: int,
    usuario: Usuario = Depends(get_usuario_actual),
    db: Session = Depends(get_db),
):
    query = text("""
        SELECT TOP 1 Id AS id, CamionID, FechaHora, Latitud, Longitud, Velocidad
        FROM dbo.Ubicaciones
        WHERE CamionID = :camion_id
        ORDER BY FechaHora DESC
    """)
    row = db.execute(query, {"camion_id": camion_id}).mappings().first()

    if not row:
        raise HTTPException(status_code=404, detail="No hay ubicaciones registradas para este camión")

    return UbicacionOut.from_row(row)


@router.get("/ubicaciones/historico/{camion_id}", response_model=list[UbicacionOut])
def obtener_historico_ubicaciones(
    camion_id: int,
    desde: Optional[datetime] = None,
    hasta: Optional[datetime] = None,
    limite: int = 100,
    usuario: Usuario = Depends(get_usuario_actual),
    db: Session = Depends(get_db),
):
    condiciones = ["CamionID = :camion_id"]
    params = {"camion_id": camion_id, "limite": limite}

    if desde:
        condiciones.append("FechaHora >= :desde")
        params["desde"] = desde
    if hasta:
        condiciones.append("FechaHora <= :hasta")
        params["hasta"] = hasta

    where_clause = " AND ".join(condiciones)

    query = text(f"""
        SELECT TOP (:limite) Id AS id, CamionID, FechaHora, Latitud, Longitud, Velocidad
        FROM dbo.Ubicaciones
        WHERE {where_clause}
        ORDER BY FechaHora DESC
    """)

    rows = db.execute(query, params).mappings().all()
    return [UbicacionOut.from_row(row) for row in rows]