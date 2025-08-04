import * as Notifications from "expo-notifications";
import { Vibration } from "react-native";

import ThemedButton from "@/src/components/ThemedButton";
import { useProductStore } from "@/src/store/UseProductStore";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


export default function PayModal() {
  const { placeOrder } = useProductStore();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { title, quantity, unit_price } = useLocalSearchParams();
  const router = useRouter();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{
    id: string;
    estado: string;
  } | null>(null);

  // se genera nuevamente el title una vez que se tiene el nro.de compra
  const handleCheckout = async () => {
    try {
      const result = await placeOrder();
      console.log("Resultado Order #", result);

      const response = await fetch(
        "https://api.desarrollosweb.net.ar/create_preference",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Nro.Orden # " + result.toString(),
            quantity: Number(quantity),
            unit_price: Number(unit_price),
          }),
        }
      );

      const data = await response.json();
      // if (data.init_point) await WebBrowser.openBrowserAsync(data.init_point);
      if (data.sandbox_init_point) {
        setCheckoutUrl(data.sandbox_init_point);
      } else {
        alert("No se recibió el link de pago");
        console.log(data);
      }

      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

const handleNavigationChange = ({ url }: { url: string }) => {
  //console.log("🔗 Interceptado:", url);

  if (
    url.includes("checkout/success") ||
    url.includes("checkout/failure") ||
    url.includes("checkout/pending")
  ) {
    setIsRedirecting(true);

    try {
      const parsedUrl = new URL(url);

      const estado = parsedUrl.searchParams.get("collection_status") ?? "desconocido";
      const idPago = parsedUrl.searchParams.get("payment_id") ?? "?";

      console.log("💵 Detalles del pago:", { idPago, estado });

      setPaymentInfo({ id: idPago, estado }); // 👈 activa pantalla de carga

      Vibration.vibrate([0, 300, 150, 300]);

      // ✅ Notificación local con sonido
      Notifications.scheduleNotificationAsync({
        content: {
          title: "🧾 Estado del pago",
          body:
            estado === "approved"
              ? "✅ Tu pago fue aprobado correctamente."
              : estado === "pending"
              ? "⏳ El pago está pendiente. Verificá más tarde."
              : "❌ Hubo un problema con el pago.",
          sound: "default", // 🔊 Sonido              
          data: { idPago, estado },
        },
        trigger: null,
      });

      // ⏳ Redirección
      setTimeout(() => {
        router.replace("/(tabs)/(productos)/(home)");
      }, 4000);

    } catch (error) {
      console.warn("❌ Error procesando la URL:", error);
    }
  }
};

return (
  <>
    <Stack.Screen
      options={{ presentation: "modal", title: "Confirmar compra" }}
    />

    {isRedirecting ? (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          zIndex: 9999,
        }}
        pointerEvents="auto"
      >
        {paymentInfo ? (
          <>
            <MaterialIcons
              name={
                paymentInfo.estado === "approved"
                  ? "check-circle"
                  : paymentInfo.estado === "pending"
                  ? "hourglass-empty"
                  : "error"
              }
              size={64}
              color={
                paymentInfo.estado === "approved"
                  ? "#4CAF50"
                  : paymentInfo.estado === "pending"
                  ? "#FFC107"
                  : "#F44336"
              }
              style={{ marginBottom: 16 }}
            />

            <Text
              style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Pago {paymentInfo.estado.toUpperCase()}
            </Text>

            <Text
              style={{
                color: "#666",
                fontSize: 16,
                marginBottom: 25,
                textAlign: "center",
              }}
            >
              ID de pago: {paymentInfo.id}
            </Text>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{ color: "#fff", marginTop: 10 }}>
              ⏳ Procesando pago...
            </Text>
          </>
        )}

        <ThemedButton
          onPress={() => router.replace("/(tabs)/(productos)/(home)")}
          style={{
            width: "100%",
            marginTop: 10,
            paddingHorizontal: 20,
            borderRadius: 12,
            }}
        >
          Volver al catálogo
        </ThemedButton>
      </View>
    ) : !checkoutUrl ? (
  <View style={styles.centeredContainer}>
    <View style={styles.card}>
      <Text style={styles.title}>
        ¿Abonar la compra de {quantity} "{title}" por ${unit_price}?
      </Text>

      <ThemedButton
        onPress={handleCheckout}
        style={{ marginTop: 20, alignSelf: "stretch" }}
      >
        Iniciar Pago
      </ThemedButton>
    </View>
  </View>
    ) : (
      <WebView
        source={{ uri: checkoutUrl }}
        style={{ flex: 1, width: "100%" }}
        startInLoadingState
        originWhitelist={["*"]}
        onShouldStartLoadWithRequest={(request) => {
          const { url } = request;

          if (
            url.includes("checkout/success") ||
            url.includes("checkout/failure") ||
            url.includes("checkout/pending")
          ) {
            handleNavigationChange({ url });
            return false;
          }

          return true;
        }}
      />
    )}
  </>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  info: { fontSize: 16, marginBottom: 20, textAlign: "center" },
centeredContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
  backgroundColor: "#f2f2f2", // o el fondo que uses
},
card: {
  backgroundColor: "white",
  padding: 20,
  borderRadius: 15,
  width: "100%",
  maxWidth: 350,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 5,
  elevation: 4,
},
title: {
  fontSize: 18,
  fontWeight: "600",
  textAlign: "center",
  marginBottom: 10,
},

});
