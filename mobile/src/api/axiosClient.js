import axios from "axios";
import * as SecureStore from "expo-secure-store";

// IMPORTANTE: reemplaza esta IP por la de tu backend en tu red local
// (la misma que viste en "Metro: exp://192.168.1.69:8081" — usa esa IP, puerto 8000)
const API_BASE_URL = "http://192.168.1.69:8000";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;