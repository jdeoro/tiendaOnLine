import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useThemeColor } from "@/src/hooks/useThemeColor";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Linking } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import RedirectingScreen from "@/src/components/RedirectingScreen";

// import { Button } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    id: string;
    estado: string;
  } | null>(null);

  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    RobotoBlack: require("@/assets/fonts/Roboto-Black.ttf"),
    RobotoBold: require("@/assets/fonts/Roboto-Bold.ttf"),
    RobotoLight: require("@/assets/fonts/Roboto-Light.ttf"),
    RobotoMedium: require("@/assets/fonts/Roboto-Medium.ttf"),
    RobotoRegular: require("@/assets/fonts/Roboto-Regular.ttf"),
    RobotoThin: require("@/assets/fonts/Roboto-Thin.ttf"),
  });

  // ✅ Enviar notificación local (sin romper hooks)
  async function sendNotification(idPago: string) {
  console.log("🔔 Entrando a sendNotification con idPago:", idPago); // 👈 NUEVO LOG    
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "✅ ¡Pago confirmado!",
          body: `Tu pago #${idPago} fue procesado con éxito.`,
          sound: "default",
        },
        trigger: null, // Notificación inmediata
      });
      console.log("📨 Notificación enviada");
    } catch (error) {
      console.error("❌ Error enviando notificación:", error);
    }
  }

  // 🎯 Escuchar Deep Links cuando el usuario vuelve
  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      console.log("🚨 handleDeepLink DISPARADO con URL:", url); // 👈 NUEVO LOG

      try {
        const parsedUrl = new URL(url);
        const cleanPath = parsedUrl.pathname
          .replace(/^\/--\//, "")
          .replace(/^\/+/, "");
        const params = Object.fromEntries(
          new URLSearchParams(
            decodeURIComponent(parsedUrl.search).replace(/^\?/, "")
          ).entries()
        );

        console.log("🔗 Deep Link URL:", url);
        console.log("📦 Parámetros:", params);
        console.log("🛣️ Ruta limpia:", cleanPath);
        console.log("🚀 Entró a handleDeepLink");

        const idPedido = params.external_reference ?? "";
        const estado = params.collection_status ?? "aprobado";
        const idPago = params.payment_id ?? "?";

        console.log("🧼 cleanPath evaluado:", cleanPath);

        if (cleanPath === "success") {
 console.log("🎯 Redirección SUCCESS: seteando redirecting");

  setIsRedirecting(true);
  setPaymentInfo({ id: idPago, estado });

  console.log("🧾 paymentInfo seteado:", { id: idPago, estado });

  if (idPedido) {
    try {
      const response = await fetch(
        `https://api.desarrollosweb.net.ar/pedidos/${idPedido}/estado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado }),
        }
      );

      const result = await response.json();
      console.log("✅ Pedido actualizado:", result);
    } catch (error) {
      console.error("❌ Error actualizando pedido:", error);
    }
  } else {
    console.warn("⚠️ ID de pedido no disponible");
  }

  console.log("🔥 Antes de notificación");
  await sendNotification(idPago); // 👈 Muy importante usar await
  console.log("✅ Notificación enviada correctamente");

  setTimeout(() => {
    router.replace("/(tabs)/(productos)/(home)");
  }, 4000);
        } else if (cleanPath === "failure") {
          console.log("🎯 Redirección FAILURE: seteando redirecting");
          setIsRedirecting(true);
          setPaymentInfo({ id: idPago, estado: "rechazado" });

          setTimeout(() => {
            router.replace("/(tabs)/(productos)/(home)");
          }, 4000);
        } else if (cleanPath === "pending") {
          console.log("🎯 Redirección PENDING: seteando redirecting");
          setIsRedirecting(true);
          setPaymentInfo({ id: idPago, estado: "pendiente" });

          setTimeout(() => {
            router.replace("/(tabs)/(productos)/(home)");
          }, 4000);
        } else {
          console.log("❓ Ruta desconocida o no match:", cleanPath);
        }
      } catch (error) {
        console.error("💥 Error procesando Deep Link:", error);
      }
    };
    Linking.getInitialURL().then((url) => {
      console.log("🔎 Linking.getInitialURL devolvió:", url); // 👈 NUEVO LOG

      if (url) handleDeepLink({ url });
    });
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos requeridos",
          "Debes habilitar las notificaciones para continuar"
        );
      }
    };

    requestPermissions();

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  }, []);

  if (!loaded) {
    return null;
  }

  console.log("🎯 Redirección SUCCESS: seteando redirecting");

  return (
    <GestureHandlerRootView
      style={{ backgroundColor: backgroundColor, flex: 1 }}
    >
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          {isRedirecting ? (
            <RedirectingScreen paymentInfo={paymentInfo} />
          ) : (
            <>
              <Stack screenOptions={{ headerShown: false }} />
              <StatusBar style="auto" />
            </>
          )}
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
