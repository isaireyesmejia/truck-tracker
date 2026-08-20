import axiosClient from "./axiosClient";

export async function registrarUbicacion({ camion_id, latitud, longitud, velocidad, timestamp }) {
  const response = await axiosClient.post("/api/registrarUbicacion", {
    idVehiculo: camion_id,
    latitud,
    longitud,
    velocidad,
    timestamp,
  });
  return response.data;
}

export async function getUltimaUbicacion(camionId) {
  const response = await axiosClient.get(`/api/ubicaciones/ultima/${camionId}`);
  return response.data;
}

export async function getHistoricoUbicaciones(camionId, { desde, hasta, limite } = {}) {
  const params = {};
  if (desde) params.desde = desde;
  if (hasta) params.hasta = hasta;
  if (limite) params.limite = limite;

  const response = await axiosClient.get(`/api/ubicaciones/historico/${camionId}`, {
    params,
  });
  return response.data;
}