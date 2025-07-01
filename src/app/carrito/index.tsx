import { useProductStore } from "@/src/store/UseProductStore";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import InputSpinner from 'react-native-input-spinner';

// Simulación de los productos del carrito.
// En un caso real, esto vendría del estado global (contexto, Zustand, Redux, etc.)
const productosMock = [
  { id: "1", nombre: "Café molido" },
  { id: "2", nombre: "Yerba mate" },
  { id: "3", nombre: "Galletitas" },
];


const CarritoScreen = () => {
  // Obtener los productos del carrito desde el store
    const { getCartItems } = useProductStore()
    const CartProduct = getCartItems()
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
      <Text style={styles.item}>• {item.title}</Text>
      <InputSpinner
        max={10}
        min={1}
        step={1}
        value={item.quantity}
        onChange={(num : number) => {
          setValue(num);
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