import Logout from "@/src/components/Logout";
import { useAuthStore } from "@/src/store/UseAuthStore";
import { Redirect, Stack } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";

const LayoutProductos = () => {
  const { checkStatus,estado } = useAuthStore();

  useEffect(() => {
    checkStatus();
  }, []);

  //console.log('estoy en layprod')
  if (estado === "checking") {
    return <ActivityIndicator style={{ margin: 60 }} size="large" color="#00dfff" />;  }

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
          headerRight: () => <Logout />,
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
