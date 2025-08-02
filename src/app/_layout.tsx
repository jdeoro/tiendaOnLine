import { useColorScheme } from '@/src/hooks/useColorScheme';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    RobotoBlack: require("@/assets/fonts/Roboto-Black.ttf"),
    RobotoBold: require("@/assets/fonts/Roboto-Bold.ttf"),
    RobotoLight: require("@/assets/fonts/Roboto-Light.ttf"),
    RobotoMedium: require("@/assets/fonts/Roboto-Medium.ttf"),
    RobotoRegular: require("@/assets/fonts/Roboto-Regular.ttf"),
    RobotoThin: require("@/assets/fonts/Roboto-Thin.ttf"),
  });

  // 🎯 Escuchar Deep Links cuando el usuario vuelve
useEffect(() => {
  const handleDeepLink = async ({ url }: { url: string }) => {
    try {
      const parsedUrl = new URL(url);
      const cleanPath = parsedUrl.pathname.replace(/^\/--\//, "").replace(/^\/+/, "");
      const params = Object.fromEntries(
        new URLSearchParams(decodeURIComponent(parsedUrl.search).replace(/^\?/, "")).entries()
      );

      console.log("🔗 Deep Link URL:", url);
      console.log("📦 Parámetros:", params);
      console.log("🛣️ Ruta limpia:", cleanPath);

      if (cleanPath === "success") {
        Alert.alert(
          "✅ Pago aprobado",
          `ID: ${params.payment_id ?? "?"}\nEstado: ${params.collection_status ?? "?"}`
        );

        const idPedido = params.external_reference ?? "";
        const estado = params.collection_status ?? "aprobado";
        
        console.log("🧾 ID de pedido recibido:", idPedido);

        if (idPedido) {
          try {
            const response = await fetch(`https://api.desarrollosweb.net.ar/pedidos/${idPedido}/estado`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ estado }),
            });

            const result = await response.json();
            console.log("✅ Pedido actualizado:", result);
          } catch (error) {
            console.error("❌ Error actualizando pedido:", error);
          }
        } else {
          console.warn("⚠️ ID de pedido no disponible");
        }

        router.replace("/(tabs)/(productos)/(home)");
      } else if (cleanPath === "failure") {
        Alert.alert("❌ Pago rechazado", "Podés intentar nuevamente");
        router.replace("/(tabs)/(productos)/(home)");
      } else if (cleanPath === "pending") {
        Alert.alert("⏳ Pago pendiente", "Te notificaremos cuando se confirme");
        router.replace("/(tabs)/(productos)/(home)");
      }
    } catch (error) {
      console.error("💥 Error procesando Deep Link:", error);
    }
  };

  // Al volver desde segundo plano
  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink({ url });
  });

  // Al recibir mientras está activa
  const subscription = Linking.addEventListener("url", handleDeepLink);
  return () => subscription.remove();
}, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView
      style={{ backgroundColor: backgroundColor, flex: 1 }}
    >
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}></Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

