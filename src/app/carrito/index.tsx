import { useProductStore } from "@/src/store/UseProductStore";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import InputSpinner from "react-native-input-spinner";

const CarritoScreen = () => {
  // Obtener los productos del carrito desde el store
  const { getCartItems } = useProductStore();
  const CartProduct = getCartItems();
  const [value, setValue] = useState(0);

  console.log("Productos en el carrito:", CartProduct);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🛒 Productos en tu carrito</Text>
      <FlatList
        data={CartProduct}
        keyExtractor={(item) => item.idprod.toString()}
        renderItem={({ item }) => (
          <View style={{ marginTop: 50 }}>
            <Text style={styles.item}>{item.title}</Text>
            <Text style={styles.item}>Precio: ${item.price}</Text>
            <InputSpinner
              max={10}
              min={1}
              step={1}
              value={item.quantity}
              onChange={(num: number) => {
                setValue(num);
                console.log(
                  `Cantidad actualizada: ${num} producto actualizado: ${item.idprod}`
                );
                // Aquí podrías actualizar la cantidad en el carrito si es necesario
              }}
              colorMax="#f04048"
              colorMin="#40c5f4"
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ fontStyle: "italic" }}>El carrito está vacío</Text>
        }
      />
    </View>
  );
};

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
