import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Alert, Button, Linking, StyleSheet, Text, View } from 'react-native';

export default function PayModal() {
  const { title, quantity, unit_price } = useLocalSearchParams();
  const router = useRouter();

  const handleCheckout = async () => {

    try {
      const response = await fetch('https://6f74e5023b7a.ngrok-free.app/create_preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          quantity: Number(quantity),
          unit_price: Number(unit_price),
        }),
      });

      const data = await response.json();
      if (data.init_point) await WebBrowser.openBrowserAsync(data.init_point);
      else alert('No se recibió el link de pago');
    } catch (error) {
      alert('Hubo un problema al iniciar el pago');
      console.error(error);
    }
  };

  // 🎯 Escuchar Deep Links cuando el usuario vuelve
  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      if (url.includes('checkout/success')) {
        Alert.alert('✅ Pago aprobado', 'Gracias por tu compra');
        router.dismiss(); // 🔙 Cierra el modal
      } else if (url.includes('checkout/failure')) {
        Alert.alert('❌ Pago rechazado', 'Podés intentar nuevamente');
        router.dismiss();
      } else if (url.includes('checkout/pending')) {
        Alert.alert('⏳ Pago pendiente', 'Te notificaremos cuando se confirme');
        router.dismiss();
      }
    };

    // Cuando vuelve la app
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // También si el link llega mientras la app está activa
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  return (
    <>
      <Stack.Screen options={{ presentation: 'modal', title: 'Confirmar compra' }} />
      <View style={styles.container}>
        <Text style={styles.info}>¿Abonar la compra de {quantity} "{title}" por ${unit_price}?</Text>
        <Button title="Iniciar pago" onPress={handleCheckout} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  info: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
});