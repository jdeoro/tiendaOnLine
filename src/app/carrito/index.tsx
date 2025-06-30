import { FlatList, StyleSheet, Text, View } from "react-native";

// Simulación de los productos del carrito.
// En un caso real, esto vendría del estado global (contexto, Zustand, Redux, etc.)
const productosMock = [
  { id: "1", nombre: "Café molido" },
  { id: "2", nombre: "Yerba mate" },
  { id: "3", nombre: "Galletitas" },
];

const CarritoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🛒 Productos en tu carrito</Text>
      <FlatList
        data={productosMock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>• {item.nombre}</Text>
        )}
        ListEmptyComponent={
          <Text style={{ fontStyle: "italic" }}>El carrito está vacío</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  item: {
    fontSize: 16,
    paddingVertical: 4,
  },
});

export default CarritoScreen;