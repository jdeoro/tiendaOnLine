import ThemedButton from '@/src/components/ThemedButton';
import { ThemedText } from '@/src/components/ThemedText';
import { ThemedView } from '@/src/components/ThemedView';
import { useProductStore } from '@/src/store/UseProductStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';


export default function PayModal() {
  const { placeOrder} = useProductStore();    
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { title, quantity, unit_price } = useLocalSearchParams();
  const router = useRouter();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

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
         }else{
          alert("No se recibió el link de pago");
          console.log(data)
          } 

      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

const handleNavigationChange = ({ url }: { url: string }) => {
  if (
    url.includes('checkout/success') ||
    url.includes('checkout/failure') ||
    url.includes('checkout/pending')
  ) {
    setIsRedirecting(true);

    setTimeout(() => {
      router.replace('/(tabs)/(productos)/(home)');
    }, 1500);
  }

};  

return (
  <>
    <Stack.Screen
      options={{ presentation: "modal", title: "Confirmar compra" }}
    />

    {isRedirecting ? (
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Redirigiendo al catálogo...</Text>
      </ThemedView>
    ) : !checkoutUrl ? (
      <>
        <ThemedText style={styles.info}>
          ¿Abonar la compra de {quantity} "{title}" por ${unit_price}?
        </ThemedText>
        <ThemedButton  onPress={handleCheckout} >Iniciar Pago</ThemedButton>
        {/* <Button title="Iniciar pago" onPress={handleCheckout} /> */}
      </>
    ) : (
      <WebView
        source={{ uri: checkoutUrl }}
        style={{ flex: 1, width: "100%" }}
        onNavigationStateChange={handleNavigationChange}
        startInLoadingState
      />
    )}
  </>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  info: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
});