import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ChoferScreen from "../screens/ChoferScreen";
import DashboardScreen from "../screens/DashboardScreen";

const Stack = createNativeStackNavigator();

const temaOscuro = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#12151a",
    card: "#1b2027",
    text: "#e7e9ec",
    border: "#2c3541",
    primary: "#d98e3f",
  },
};

export default function RootNavigator() {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#12151a" }}>
        <ActivityIndicator color="#d98e3f" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={temaOscuro}>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#1b2027" }, headerTintColor: "#e7e9ec" }}>
        {usuario ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Truck Tracker" }} />
            <Stack.Screen name="Chofer" component={ChoferScreen} options={{ title: "Modo Chofer" }} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Dashboard" }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}