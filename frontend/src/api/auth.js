import axiosClient from "./axiosClient";

export async function login(email, password) {
  const response = await axiosClient.post("/api/auth/login", {
    email: email,
    password: password,
  });

  const { access_token, nombre, idUsuario } = response.data;
  localStorage.setItem("token", access_token);
  localStorage.setItem("nombre", nombre ?? "");
  localStorage.setItem("idUsuario", idUsuario ?? "");
  return { access_token, nombre, idUsuario };
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("nombre");
  localStorage.removeItem("idUsuario");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}

export function getNombreUsuario() {
  return localStorage.getItem("nombre") || "";
}