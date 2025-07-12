import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useAuthStore } from '@/src/store/UseAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable } from 'react-native';

export default function TabLayout() {

  const { checkStatus,estado } = useAuthStore();
  const color = useThemeColor({}, 'primary')

  useEffect(() => {
    checkStatus();
  }, []);

  if (estado === "checking") {
    return <ActivityIndicator style={{ margin: 60 }} size="large" color={color} />;  }

  if (estado === "unauthenticated") {
    return <Redirect href="/auth/login"/>;
  }


  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: color ,headerShown: false, tabBarStyle: { paddingBottom: Platform.OS === 'ios' ? 30 : 20,
      height: Platform.OS === 'ios' ? 80 : 70,  } }}>
      <Tabs.Screen
        name="(productos)"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="list-circle-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="setting/index"
        options={{
          title: 'Setting',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="settings-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="salir/index"
        options={{
          title: 'Salir',
          tabBarIcon: ({ color }) => (
            <Ionicons size={30} name="exit-outline" color={color} />
          ),
          // 👇 Aquí interceptamos el toque
          tabBarButton: (props) => {
            const { logout } = useAuthStore(); // o el hook correcto

            const handlePress = () => {
              Alert.alert(
                'Confirmación',
                '¿Deseas cerrar sesión?',
                [
                  {
                    text: 'Cancelar',
                    style: 'cancel',
                  },
                  {
                    text: 'Confirmar',
                    onPress: () => {
                      logout();
                      // Si querés navegar después del logout, hacelo acá
                    },
                  },
                ],
                { cancelable: false }
              );
            };
          const { delayLongPress, ...restProps } = props;

              return (
        <Pressable onPress={handlePress} style={props.style}>
      {/* Esto conserva el ícono original dentro del botón */}
      {props.children}
    </Pressable>

  );

          },
        }}
      />
    </Tabs>
  );
}
