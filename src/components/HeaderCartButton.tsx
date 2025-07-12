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
    // <Pressable
    //   style={{ marginRight: 0 }}
    //   onPress={() => {
    //     router.push("/carrito");
    //   }}
    // >
    //   <Ionicons name="cart-outline" size={30} />
    //   {quantitySelectedProducts > 0 && (
    //     <View style={styles.carrito}>
    //       <Text style={{ color: "white", fontSize: 11, fontWeight: "700" }}>
    //         {quantitySelectedProducts }
    //       </Text>
    //     </View>
    //   )}
    // </Pressable>

  <Pressable onPress={() => router.push("/carrito")} style={{ marginRight: 12 }}>
    <View style={styles.iconWrapper}>
      <Ionicons name="cart-outline" size={36} />
      {quantitySelectedProducts > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {quantitySelectedProducts}
          </Text>
        </View>
      )}
    </View>
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

  iconWrapper: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 4, // Ayuda a que el badge tenga espacio
  },
  badge: {
    position: "absolute",
    top: 2, // lo bajamos un poco
    right: 2, // lo alejamos del borde
    backgroundColor: "#ff0000",
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // Asegura que esté por encima del ícono
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

});
export default HeaderCartButton;
