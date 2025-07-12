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
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import InputSpinner from "react-native-input-spinner";

const URL_IMG = process.env.EXPO_PUBLIC_IMG || "";

const Productoid = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [cantidad, setCantidad] = useState("0");
  const [addedToCart, setAddedToCart] = useState(false);
  const { id } = useLocalSearchParams();
  const { ProducData } = useProductStore();
  const [productoinfo, setProductoInfo] = useState<Producto>();

  const router = useRouter();

  const {
    quantitySelectedProducts,
    SetSelectedProducts,
    addToCart,
    getCartItems,
  } = useProductStore();


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderCartButton />,
    });
    // console.log("quantitySelectedProducts ->", quantitySelectedProducts);
  }, [quantitySelectedProducts]);

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
        title: productoinfo.title,
      });
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

  const onAddToCart = () => {
    {
      if (parseInt(cantidad) <= 0) {
        Alert.alert("Cantidad inválida", "La cantidad debe ser mayor a 0");
        console.log("Cantidad debe ser mayor a 0");
        return;
      }
      setAddedToCart(true);
      console.log("cantidad a grabar :", cantidad);
      
      const newCartItem = {
        idprod: productoinfo.id,
        title: productoinfo.title,
        price: productoinfo.price,
        size: selectedTalle as Size,
        images: productoinfo.images[0],
        quantity: parseInt(cantidad, 10) || 1, // Aseguramos que sea un número
      };
      addToCart(newCartItem);
      SetSelectedProducts(parseInt(cantidad)); // + 1
      
      console.log(`Producto: ${productoinfo.id} cantidad : ${cantidad} quantitySelectedProducts :${cantidad}` );
    }
  };

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
            {productoinfo.images.map((item, index) => {
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
              <Pressable
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
              </Pressable>
            );
          })}
        </View>

        <View style={style.spinnerContainer}>
          <InputSpinner
            max={10}
            min={0}
            step={1}
            value={cantidad}
            onChange={(num: number) => {
              setCantidad(num.toString());
              console.log(
                `${num} productos seleccioados`
              );
            }}
            colorMax="#f04048"
            colorMin="#40c5f4"
          />
        </View>

        {/* Botón Agregar al carrito */}
        <Pressable
          onPress={() => { 
            if (selectedTalle) {
              onAddToCart();
            }
          }}
          disabled={!selectedTalle  }
          style={{ 
            backgroundColor: selectedTalle ? "#007bff" : "#ccc",
            paddingVertical: 12,
            borderRadius: 8,
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", paddingVertical: 10 }}>
            Agregar al carrito
          </Text>
        </Pressable>

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
  spinnerContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  
});

export default Productoid;
