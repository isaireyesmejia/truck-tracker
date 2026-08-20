import { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { login as apiLogin, logout as apiLogout } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarSesion() {
      const token = await SecureStore.getItemAsync("token");
      const nombre = await SecureStore.getItemAsync("nombreUsuario");
      if (token) {
        setUsuario({ nombre });
      }
      setCargando(false);
    }
    cargarSesion();
  }, []);

  async function login(email, password) {
    const data = await apiLogin(email, password);
    setUsuario({ nombre: data.nombre });
    return data;
  }

  async function logout() {
    await apiLogout();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}