// app/modal/_layout.tsx

import { Stack } from 'expo-router';

export default function ModalRootLayout() {
  return (
    <Stack>
      {/* Esta Stack.Screen es crucial para definir cómo se presenta la ruta 'pay' */}
      <Stack.Screen
        name="pay" // Esto mapea a la carpeta 'pay' dentro de 'modal'
        options={{
          presentation: 'modal', // Indica que esta ruta debe presentarse como un modal
          headerShown: false,    // O true, dependiendo de si quieres una cabecera en el modal
          // Puedes añadir otras opciones aquí, como un título para el modal
          // title: 'Detalles del Pago',
        }}
      />
      {/* Si tuvieras otros modales en la carpeta 'modal' (ej. '/modal/settings'),
          añadirías otra <Stack.Screen name="settings" options={{ presentation: 'modal' }} /> */}
    </Stack>
  );
}