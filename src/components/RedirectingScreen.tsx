import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  paymentInfo: { id: string; estado: string } | null;
};

const RedirectingScreen = ({ paymentInfo }: Props) => {

  console.log('🔍 Renderizando pantalla de redirección')    
  console.log("💡 paymentInfo en pantalla:", paymentInfo);

return (
  <View style={styles.container}>
    <Text style={styles.title}>
      {paymentInfo
        ? `Pago ${paymentInfo.estado.toUpperCase()}`
        : "⏳ Procesando pago..."}
    </Text>

    {paymentInfo?.id && (
      <Text style={styles.subtitle}>ID: {paymentInfo.id}</Text>
    )}

    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
    <Text style={styles.redirecting}>Redirigiendo al catálogo...</Text>
  </View>
);
}

export default RedirectingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#666", // mismo fondo gris
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 20,
  },
  redirecting: {
    marginTop: 12,
    color: "white",
    fontSize: 14,
  },
});
