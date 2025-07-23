import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function DeepLinkRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirigí a donde quieras
    router.dismiss(); // o router.replace('/carrito'), etc.
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Procesando resultado del pago...</Text>
    </View>
  );
}