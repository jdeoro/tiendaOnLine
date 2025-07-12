import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function RegisterLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        title: "Registrarse", // ✅ Título de la pantalla
        headerTitleAlign: "center", // ✅ Centra el título
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ paddingHorizontal: 10 }} // ✅ Aumenta la zona de toque
          >
            <Ionicons name="arrow-back" size={26} color="black" />
          </TouchableOpacity>
        ),
      }}
    />
  );
}