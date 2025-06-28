//import { getProducts } from '@/actions/product-actions';
import { ListProduct } from '@/src/components/ListProduct';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Producto } from '@/src/interfaces/data';
import { useProductStore } from '@/src/store/UseProductStore';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';


const ProductsHome = () => {
  const { ProductsList  } = useProductStore()

  const foreColor = useThemeColor({}, 'tint')
  const backgroundColor = useThemeColor( {} ,'background')
  const backgroundGris  = useThemeColor( {}, 'backSecondary')

  let ref = useRef(0);

  const [nextPage, setNextPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Producto[]>([]);
  
  
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