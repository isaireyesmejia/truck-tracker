import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import { registrarUbicacion } from "../api/ubicaciones";

const INTERVALO_MS = 15000; // cada 15 segundos

export default function ChoferScreen() {
  const [camionId, setCamionId] = useState("");
  const [rastreando, setRastreando] = useState(false);
  const [permisoOk, setPermisoOk] = useState(false);
  const [ultimoEnvio, setUltimoEnvio] = useState(null);
  const [error, setError] = useState("");
  const intervaloRef = useRef(null);

  useEffect(() => {
    async function pedirPermiso() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermisoOk(status === "granted");
      if (status !== "granted") {
        setError("Se necesita permiso de ubicación para usar el modo chofer.");
      }
    }
    pedirPermiso();

    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, []);

  async function enviarUbicacionActual() {
    try {
      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const data = await registrarUbicacion({
        camion_id: parseInt(camionId, 10),
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
        velocidad: posicion.coords.speed != null ? Math.max(0, posicion.coords.speed * 3.6) : null, // m/s -> km/h
        timestamp: new Date(posicion.timestamp).toISOString(),
      });

      setUltimoEnvio(new Date());
      setError("");
      return data;
    } catch (err) {
      setError("Error al enviar ubicación: " + (err.response?.data?.detail || err.message));
    }
  }

  function iniciarRastreo() {
    const id = parseInt(camionId, 10);
    if (!id) {
      Alert.alert("Falta el camión", "Ingresa el ID de camión antes de iniciar.");
      return;
    }
    if (!permisoOk) {
      Alert.alert("Permiso requerido", "Activa el permiso de ubicación en los ajustes del teléfono.");
      return;
    }

    setRastreando(true);
    enviarUbicacionActual(); // envío inmediato al iniciar
    intervaloRef.current = setInterval(enviarUbicacionActual, INTERVALO_MS);
  }

  function detenerRastreo() {
    setRastreando(false);
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>MODO CHOFER</Text>
      <Text style={styles.title}>Compartir ubicación</Text>

      <Text style={styles.label}>ID de camión</Text>
      <TextInput
        style={styles.input}
        value={camionId}
        onChangeText={setCamionId}
        keyboardType="number-pad"
        editable={!rastreando}
        placeholder="Ej. 1"
        placeholderTextColor="#8a93a0"
      />

      <View style={styles.statusBox}>
        <View style={[styles.dot, { backgroundColor: rastreando ? "#3fa9a0" : "#8a93a0" }]} />
        <Text style={styles.statusText}>
          {rastreando ? "Rastreando activamente" : "Rastreo detenido"}
        </Text>
      </View>

      {ultimoEnvio && (
        <Text style={styles.lastSent}>
          Último envío: {ultimoEnvio.toLocaleTimeString()}
        </Text>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {rastreando ? (
        <TouchableOpacity style={styles.buttonStop} onPress={detenerRastreo}>
          <Text style={styles.buttonText}>Detener rastreo</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.buttonStart} onPress={iniciarRastreo}>
          <Text style={styles.buttonText}>Iniciar rastreo</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.hint}>
        Mantén la app abierta mientras manejas. La ubicación se envía cada {INTERVALO_MS / 1000} segundos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#12151a", padding: 20 },
  eyebrow: { color: "#d98e3f", fontSize: 11, letterSpacing: 2, fontWeight: "600", marginTop: 12 },
  title: { color: "#e7e9ec", fontSize: 22, fontWeight: "700", marginBottom: 20 },
  label: { color: "#8a93a0", fontSize: 13, marginBottom: 6 },
  input: {
    backgroundColor: "#232a33",
    borderWidth: 1,
    borderColor: "#2c3541",
    borderRadius: 8,
    padding: 12,
    color: "#e7e9ec",
    fontSize: 15,
    marginBottom: 20,
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1b2027",
    borderWidth: 1,
    borderColor: "#2c3541",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  statusText: { color: "#e7e9ec", fontSize: 14 },
  lastSent: { color: "#8a93a0", fontSize: 12, marginBottom: 14 },
  error: { color: "#c0524a", fontSize: 13, marginBottom: 14 },
  buttonStart: {
    backgroundColor: "#d98e3f",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonStop: {
    backgroundColor: "#c0524a",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#12151a", fontWeight: "700", fontSize: 15 },
  hint: { color: "#8a93a0", fontSize: 12, marginTop: 16, lineHeight: 18 },
});