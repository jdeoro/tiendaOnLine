import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useProductStore } from '../store/UseProductStore';


// ***********************      GLOBO CARRITO

const HeaderCartButton = () => {
  const { quantitySelectedProducts, getCartItems } = useProductStore();

  const router = useRouter();
  //const totalElementos = 3

  // console.log("Total elementos en el carrito:", quantitySelectedProducts);  

 useEffect(() => {
    const contadorProductos = () => {
      const CartProduct = getCartItems();
      const totalElementos = CartProduct.reduce(
        (total, item) => total + item.quantity,
        0
      );
    };
    contadorProductos();
 }, [])

  return (
    <Pressable
      style={{ marginRight: 15 }}
      onPress={() => {
        router.push("/carrito");
      }}
    >
      <Ionicons name="cart-outline" size={40} />
      {quantitySelectedProducts > 0 && (
        <View style={styles.carrito}>
          <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
            {quantitySelectedProducts }
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export const styles = StyleSheet.create({
  carrito: {
    position: "absolute",
    right: -0,
    top: -1,
    backgroundColor: "#ff0000",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default HeaderCartButton;
