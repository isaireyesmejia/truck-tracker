import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { usuario, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola, {usuario?.nombre || "Usuario"}</Text>
      <Text style={styles.subtitle}>Elige un modo para continuar</Text>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Chofer")}>
        <Text style={styles.cardTitle}>Modo Chofer</Text>
        <Text style={styles.cardDesc}>Comparte tu ubicación mientras manejas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Dashboard")}>
        <Text style={styles.cardTitle}>Dashboard</Text>
        <Text style={styles.cardDesc}>Ve la flotilla en el mapa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#12151a", padding: 20 },
  greeting: { color: "#e7e9ec", fontSize: 22, fontWeight: "700", marginTop: 12 },
  subtitle: { color: "#8a93a0", fontSize: 14, marginBottom: 24 },
  card: {
    backgroundColor: "#1b2027",
    borderWidth: 1,
    borderColor: "#2c3541",
    borderRadius: 10,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: { color: "#e7e9ec", fontSize: 17, fontWeight: "600", marginBottom: 4 },
  cardDesc: { color: "#8a93a0", fontSize: 13 },
  logout: { marginTop: 20, alignSelf: "center" },
  logoutText: { color: "#c0524a", fontSize: 14 },
});