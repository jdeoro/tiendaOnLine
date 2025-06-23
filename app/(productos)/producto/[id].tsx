import { Producto } from '@/interfaces/product'
import { useProductStore } from '@/store/UseProductStore'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

const Productoid = () => {

  const navigation = useNavigation()
  const { id } = useLocalSearchParams()
  const { ProducData } = useProductStore()
  const [ productoinfo, setProductoInfo ] = useState<Producto>()

  useEffect(() => {
    navigation.setOptions({
      headerRight : () => <Ionicons name="camera-outline" size={25} />
    })
  }, []);

useEffect(() => {
  const retproducto = async () => {
    const numericId = Array.isArray(id) ? Number(id[0]) : Number(id);
    const result = await ProducData(numericId);
    if (result) {
      setProductoInfo(result.producto);
      console.log("productoinfo", result);
    }
  };

  retproducto();
}, [id, ProducData]);
  

  return (
  <>
    {productoinfo ? (
      <View>
        <Text>{productoinfo.title}</Text>
        {/* Otros datos */}
      </View>
    ) : (
      <ActivityIndicator size="large" color="#0000ff" />
    )}
  </>

  )
}

export default Productoid