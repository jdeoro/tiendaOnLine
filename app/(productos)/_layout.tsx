import Logout from "@/components/Logout";
import { useAuthStore } from "@/store/UseAuthStore";
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
    return <ActivityIndicator  size="large" color="#0000ff" />;  }

  if (estado === "unauthenticated") {
    return <Redirect href="/auth/login"/>;
  }
  
  //console.log("estado en layout productos: ", estado);

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
