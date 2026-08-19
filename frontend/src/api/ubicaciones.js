import axiosClient from "./axiosClient";

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