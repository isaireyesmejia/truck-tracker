import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // La navegación cambia sola: RootNavigator reacciona a "usuario" en el context
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Correo o contraseña incorrectos."
          : "No se pudo conectar con el servidor."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>FLEET CONTROL</Text>
      <Text style={styles.title}>Truck Tracker</Text>
      <Text style={styles.subtitle}>Monitoreo de flotilla en tiempo real</Text>

      <Text style={styles.label}>Correo</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#8a93a0"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#8a93a0"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#1b1300" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#12151a",
  },
  eyebrow: {
    color: "#d98e3f",
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "600",
    marginBottom: 4,
  },
  title: {
    color: "#e7e9ec",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "#8a93a0",
    fontSize: 14,
    marginBottom: 24,
  },
  label: {
    color: "#8a93a0",
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#232a33",
    borderWidth: 1,
    borderColor: "#2c3541",
    borderRadius: 8,
    padding: 12,
    color: "#e7e9ec",
    fontSize: 15,
  },
  error: {
    color: "#c0524a",
    fontSize: 13,
    marginTop: 12,
  },
  button: {
    backgroundColor: "#d98e3f",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#1b1300",
    fontWeight: "700",
    fontSize: 15,
  },
});