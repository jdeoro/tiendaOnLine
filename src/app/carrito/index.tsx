import { useProductStore } from "@/src/store/UseProductStore";
import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import InputSpinner from "react-native-input-spinner";

const CarritoScreen = () => {
  // Obtener los productos del carrito desde el store
  const { getCartItems } = useProductStore();
  const CartProduct = getCartItems();
  const [value, setValue] = useState(0);
  const URL_IMG = process.env.EXPO_PUBLIC_IMG || "";

  console.log("Productos en el carrito:", CartProduct);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🛒 Productos en tu carrito</Text>


<FlatList
  data={CartProduct}
  keyExtractor={(item) => item.idprod.toString()}
  renderItem={({ item }) => (
    <View style={styles.cardWrapper}>
      <View style={styles.cartContainer}>
        <View style={styles.imageColumn}>
          <Image
            source={{ uri: URL_IMG + item.images }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.contentColumn}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>Precio: ${item.price}</Text>
        </View>
      </View>

      <View style={styles.spinnerContainer}>
        <InputSpinner
          max={10}
          min={1}
          step={1}
          value={item.quantity}
          onChange={(num: number) => {
            setValue(num)
            console.log(`Cantidad actualizada: ${num} producto actualizado: ${item.idprod}`)
          }}
          colorMax="#f04048"
          colorMin="#40c5f4"
        />
      </View>
    </View>  )}
  ListEmptyComponent={
    <Text style={{ fontStyle: 'italic' }}>El carrito está vacío</Text>
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
cardWrapper: {
  backgroundColor: '#e1e1e1',
  borderRadius: 10,
  padding: 10,
  marginVertical: 8,
},
cartContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
imageColumn: {
  flex: 1,
  marginRight: 10,
},
image: {
  width: 80,
  height: 80,
  borderRadius: 10,
},
contentColumn: {
  flex: 2,
  justifyContent: 'center',
},
title: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 4,
},
price: {
  fontSize: 14,
  color: '#333',
},
spinnerContainer: {
  marginTop: 10,
  alignItems: 'center',
},
});

export default CarritoScreen;
