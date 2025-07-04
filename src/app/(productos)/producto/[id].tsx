import HeaderCartButton from "@/src/components/HeaderCartButton";
import { RemoteImage } from "@/src/components/RemoteImage";
import { Size } from "@/src/interfaces/data";
import { Producto } from "@/src/interfaces/product";
import { useProductStore } from "@/src/store/UseProductStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

const URL_IMG = process.env.EXPO_PUBLIC_IMG || "";

const Productoid = () => {
  const { quantitySelectedProducts,SetSelectedProducts,addToCart, getCartItems } = useProductStore()
  const [modalVisible, setModalVisible] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { ProducData } = useProductStore();
  const [productoinfo, setProductoInfo] = useState<Producto>();
  const router = useRouter();

  // Cart
  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => <Ionicons name="cart-outline" size={25} />,
  //   });
  // }, []);

  useEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <HeaderCartButton  />
    ),
  });
    }, [quantitySelectedProducts]);
    
// useEffect(() => {
//   navigation.setOptions({
//     headerRight: () => (
//       <Pressable style={{ marginRight: 15 }}
//         onPress={() => {
//           console.log("Carrito presionado");
//           router.push("/carrito")
//         }}
//       >
//         <Ionicons name="cart-outline" size={40} />
//         {quantitySelectedProducts > 0 && (
//           <View
//             style={{
//               position: "absolute",
//               right: -0,
//               top: -1,
//               backgroundColor: "red",
//               borderRadius: 10,
//               width: 20,
//               height: 20,
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
//               {quantitySelectedProducts}
//             </Text>
//           </View>
//         )}
//       </Pressable>
//     ),
//   });
// }, [quantitySelectedProducts]);

  useEffect(() => {
    const retproducto = async () => {
      const numericId = Array.isArray(id) ? Number(id[0]) : Number(id);
      const result = await ProducData(numericId);
      if (result) {
        setProductoInfo(result.producto);
        console.log("productoinfo ->", result);
      }
    };

    retproducto();
  }, [id, ProducData]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTalle, setSelectedTalle] = useState<string | null>(null);

  useEffect(() => {
    if (productoinfo?.images?.length) {
      setSelectedImage(`${URL_IMG}${productoinfo.images[0]}`);
    }
  }, [productoinfo]);

  useEffect(() => {
    if (productoinfo) {
      navigation.setOptions({
        title: productoinfo.title,})
    }
  }, [productoinfo]);

  if (!productoinfo) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ marginTop: 250 }}
      />
    );
  }
 
 const onAddToCart = () => {{
  setAddedToCart(true);
  SetSelectedProducts(quantitySelectedProducts + 1);

  const newCartItem = {
    idprod: productoinfo.id,
    title: productoinfo.title,
    price: productoinfo.price,
    size: selectedTalle as Size ,
    images: productoinfo.images[0] ,
    quantity: 1, 
  };

addToCart(newCartItem);
// console.log("🧾 Carrito actualizado:", getCartItems());

 
  console.log("Producto agregado al carrito:", productoinfo.id);
console.log()
  }
 }

  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
          paddingTop: 10,
          paddingHorizontal: 16,
        }}
      >
        {/* Galería: Miniaturas + Imagen */}
        <View style={{ flexDirection: "row", marginBottom: 24 }}>
          {/* Miniaturas */}
          <View style={{ width: 80 }}>
            {
              productoinfo.images.map((item,index) => {
                const fullUri = `${URL_IMG}${item}`;
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setSelectedImage(fullUri)}
                  >
                    <RemoteImage
                      uri={fullUri}
                      style={{
                        width: 60,
                        height: 60,
                        marginBottom: 10,
                        borderRadius: 6,
                        borderWidth: selectedImage === fullUri ? 2 : 0,
                        borderColor: "#007bff",
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
          </View>

          {/* Imagen principal */}
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {selectedImage && (
              <TouchableWithoutFeedback
                onPress={() => {
                  console.log("Tocada la imagen principal");
                  setModalVisible(true);
                }}
              >
                <Image
                  source={{ uri: selectedImage }}
                  style={{
                    width: "100%",
                    height: 300,
                    resizeMode: "contain",
                    borderRadius: 8,
                  }}
                />
              </TouchableWithoutFeedback>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 6,
                }}
              >
                <Text style={{ color: "#007bff", fontSize: 13 }}>
                  🔍 Tocá la imagen para ampliarla
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Descripción */}
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
          {productoinfo.descripcion}
        </Text>

        {/* Precio */}
        <Text style={{ fontSize: 16, color: "#007bff", marginBottom: 16 }}>
          ${productoinfo.price}
        </Text>

        {/* Talles */}
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>
          Talles disponibles:
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {productoinfo.sizes?.map((talle) => {
            const isSelected = selectedTalle === talle;
            return (
              <TouchableOpacity
                key={talle}
                onPress={() => setSelectedTalle(talle)}
              >
                <View
                  style={{
                    borderWidth: 1.5,
                    borderColor: isSelected ? "#007bff" : "#ccc",
                    backgroundColor: isSelected ? "#e6f0ff" : "#fff",
                    borderRadius: 6,
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                  }}
                >
                  <Text style={{ color: isSelected ? "#007bff" : "#333" }}>
                    {talle}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Género */}
        {/* <Text style={{ color: "#555" }}>
          Género: {productoinfo.gender || "No especificado"}
        </Text> */}

        <TouchableOpacity
          onPress={() => {
            if (selectedTalle) {
              onAddToCart();
              //setAddedToCart(true);
            }
          }}
          disabled={!selectedTalle}
          style={{
            backgroundColor: selectedTalle ? "#007bff" : "#ccc",
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{ color: "#fff", fontWeight: "600", paddingVertical: 10 }}
          >
            Agregar al carrito
          </Text>
        </TouchableOpacity>

        {addedToCart && (
          <Text style={{ color: "green", marginTop: 10 }}>
            Producto agregado al carrito ✅
          </Text>
        )}
      </ScrollView>

      {/* *********** MODAL PARA ZOOM  **********/}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Botón para cerrar */}
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              position: "absolute",
              top: 40,
              right: 20,
              zIndex: 1,
            }}
          >
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>

          {/* Imagen en pantalla completa */}
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
            />
          )}
        </View>
      </Modal>
    </>
  );
};

export const style = StyleSheet.create({
  imageStyle: {
    width: 200,
    height: 200,
  },
  remoteImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Productoid;
