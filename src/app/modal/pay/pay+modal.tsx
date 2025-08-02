import ThemedButton from "@/src/components/ThemedButton";
import { ThemedText } from "@/src/components/ThemedText";
import { useProductStore } from "@/src/store/UseProductStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

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

  // const handleNavigationChange = ({ url }: { url: string }) => {
  //   //console.log("url( para redireccionar):", url);
  //   if (
  //     url.includes("checkout/success") ||
  //     url.includes("checkout/failure") ||
  //     url.includes("checkout/pending")
  //   ) {
  //     setIsRedirecting(true);

  //     setTimeout(() => {
  //       router.replace("/(tabs)/(productos)/(home)");
  //     }, 1500);
  //   }
  // };

const handleNavigationChange = ({ url }: { url: string }) => {
  console.log("🔗 Interceptado:", url);

  if (
    url.includes("checkout/success") ||
    url.includes("checkout/failure") ||
    url.includes("checkout/pending")
  ) {
    try {
      const parsedUrl = new URL(url);

      const estado = parsedUrl.searchParams.get("collection_status") ?? "desconocido";
      const idPago = parsedUrl.searchParams.get("payment_id") ?? "?";

      console.log("💵 Detalles del pago:", { idPago, estado });

      setPaymentInfo({ id: idPago, estado }); // 👈 esto llena la pantalla de carga
      setIsRedirecting(true);

      setTimeout(() => {
        router.replace("/(tabs)/(productos)/(home)");
      }, 4000);
    } catch (error) {
      console.warn("❌ Error procesando la URL:", error);
      setIsRedirecting(true); // igual mostramos loader aunque no sepamos qué pasó
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
      zIndex: 9999,
      elevation: 10,
      paddingHorizontal: 20,
    }}
    pointerEvents="auto"
  >
    {paymentInfo ? (
      <>
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Pago {paymentInfo.estado.toUpperCase()}
        </Text>
        <Text style={{ color: "#fff", fontSize: 16, marginBottom: 20 }}>
          ID de pago: {paymentInfo.id}
        </Text>
      </>
    ) : (
      <Text style={{ color: "#fff", fontSize: 16, marginBottom: 20 }}>
        ⏳ Procesando pago...
      </Text>
    )}

    <ActivityIndicator size="large" color="#fff" />
    <Text style={{ marginTop: 10, color: "#fff" }}>
      Redirigiendo al catálogo...
    </Text>
  </View>
      ) : !checkoutUrl ? (
        <>
          <ThemedText style={styles.info}>
            ¿Abonar la compra de {quantity} "{title}" por ${unit_price}?
          </ThemedText>
          <ThemedButton onPress={handleCheckout}>Iniciar Pago</ThemedButton>
          {/* <Button title="Iniciar pago" onPress={handleCheckout} /> */}
        </>
      ) : (
        <WebView
          source={{ uri: checkoutUrl }}
          style={{ flex: 1, width: "100%" }}
          startInLoadingState
          originWhitelist={["*"]} // 👈 Permite todas las URLs, incluido prutien://
          onShouldStartLoadWithRequest={(request) => {
            const { url } = request;
            //console.log("🔗 interceptado:", url);

            if (
              url.includes("checkout/success") ||
              url.includes("checkout/failure") ||
              url.includes("checkout/pending")
            ) {
              handleNavigationChange({ url }); // Ejecuta lógica de redirección
              return false; // Detiene la navegación dentro del WebView
            }

            return true; // Permite otras URLs
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
});
