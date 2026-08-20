import axiosClient from "./axiosClient";
import * as SecureStore from "expo-secure-store";

export async function login(email, password) {
  const response = await axiosClient.post("/api/auth/login", {
    email,
    password,
  });

  const { access_token, nombre, idUsuario } = response.data;
  await SecureStore.setItemAsync("token", access_token);
  await SecureStore.setItemAsync("nombreUsuario", nombre);
  await SecureStore.setItemAsync("idUsuario", String(idUsuario));
  return response.data;
}

export async function logout() {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("nombreUsuario");
  await SecureStore.deleteItemAsync("idUsuario");
}

export async function isAuthenticated() {
  const token = await SecureStore.getItemAsync("token");
  return Boolean(token);
}

export async function getNombreUsuario() {
  return SecureStore.getItemAsync("nombreUsuario");
}