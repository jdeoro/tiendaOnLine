//import { getProducts } from '@/actions/product-actions';
import HeaderCartButton from '@/src/components/HeaderCartButton';
import { ListProduct } from '@/src/components/ListProduct';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Producto } from '@/src/interfaces/data';
import { useProductStore } from '@/src/store/UseProductStore';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';



const ProductsHome = () => {
  const { quantitySelectedProducts,SetSelectedProducts,addToCart, ProductsList  } = useProductStore()

  const foreColor = useThemeColor({}, 'tint')
  const backgroundColor = useThemeColor( {} ,'background')
  const backgroundGris  = useThemeColor( {}, 'backSecondary')

  let ref = useRef(0);
  const navigation = useNavigation();
  const [nextPage, setNextPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Producto[]>([]);
  const router = useRouter();
  
  useEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <HeaderCartButton  />
    ),
  });


    // <CartButton />
    // navigation.setOptions({

    //   headerLeft: () => (
    //     <Pressable style={{ marginRight: 15 }}
    //       onPress={() => {
    //         console.log("Carrito presionado");
    //         router.push("/carrito")
    //       }}
    //     >
    //       <Ionicons name="cart-outline" size={40} />
    //       {quantitySelectedProducts > 0 && (
    //         <View
    //           style={{
    //             position: "absolute",
    //             right: -0,
    //             top: -1,
    //             backgroundColor: "red",
    //             borderRadius: 10,
    //             width: 20,
    //             height: 20,
    //             justifyContent: "center",
    //             alignItems: "center",
    //           }}
    //         >
    //           <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
    //             {quantitySelectedProducts}
    //           </Text>
    //         </View>
    //       )}
    //     </Pressable>
    //   ),
    // });
  }, [quantitySelectedProducts]);

  const loadNextPage = async () => {
        if(loading) {
          return
        }

       if ( (ref.current === nextPage) && ref.current >0) {
          // fin de carga
          console.log(ref.current)
          console.log("se ha alcanzado el fin de los datos ")
          return null
       }
      console.log("lEYENDO DATOS para la pagina:"+nextPage);
      console.log("pagina actual:",nextPage)
      console.log("paginas totales",ref.current)

      setLoading(true)       
        
      const listado = await ProductsList(10, nextPage * 10);
      const { pagina,paginas,productos,reg} = listado

      if( reg===0){
          setLoading(false)       
         return
      }

      if (ref.current === 0) {
        ref.current = paginas
      }

        setProducts( (existinProduct) => {
        return [...existinProduct, ...productos]
      });


      setNextPage(pagina)
      setLoading(false)       
      console.log("SE EJECUTO LA LECTURA DE PRODUCTOS,PAGINA:", pagina);

  };

  useEffect(() => {
    loadNextPage()
  }, [])

  
  return (
    <View style={{ paddingHorizontal: 10, ...StyleSheet.absoluteFillObject }}>
    <FlatList
      data= {products}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      onEndReachedThreshold={0.3}
      renderItem={({ item }) => <ListProduct product={item} />}
      ListFooterComponent={() => loading && <ActivityIndicator style={styles.footer}   />}    
      onEndReached={loadNextPage}      
    />      

    </View>   

  )
}

const styles = StyleSheet.create({
  footer: { 
    height: 35,
    width: '100%',
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    flexDirection: 'row',
  }

})

export default ProductsHome