import Logout from "@/src/components/Logout";
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { useAuthStore } from "@/src/store/UseAuthStore";
import { Redirect, Stack } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";


const LayoutProductos = () => {
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
    <Stack>
      <Stack.Screen
        name="(home)/index"
        options={{
          headerShown: true,
          title: "Productos",
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 10, marginRight: 20 }}>
              <Logout />
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="producto/[id]"
        options={{ headerShown: true, title: "Producto" }}
      />
    </Stack>
  );
};

export default LayoutProductos;
