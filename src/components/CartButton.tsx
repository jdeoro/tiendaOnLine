import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useProductStore } from '../store/UseProductStore';

const CartButton = () => {
const { quantitySelectedProducts,SetSelectedProducts,addToCart, ProductsList  } = useProductStore()    
  const navigation = useNavigation();    
  const router = useRouter();  
  return (
    navigation.setOptions({
      headerLeft: () => (
        <Pressable style={{ marginRight: 15 }}
          onPress={() => {
            console.log("Carrito presionado");
            router.push("/carrito")
          }}
        >
          <Ionicons name="cart-outline" size={40} />
          {quantitySelectedProducts > 0 && (
            <View
              style={{
                position: "absolute",
                right: -0,
                top: -1,
                backgroundColor: "red",
                borderRadius: 10,
                width: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
                {quantitySelectedProducts}
              </Text>
            </View>
          )}
        </Pressable>
      ),
    }))
}

export default CartButton

