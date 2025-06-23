import { Producto } from '@/interfaces/data';
import { router } from 'expo-router';
import { Image, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface Props {
  product: Producto;
}

export const ProductCard = ({ product }: Props) => {
 
  

 const handlePress = (e: number) => {
    console.warn("se ha presionado click en la imagen " + e);
    router.navigate({
      pathname: "/(productos)/producto/[id]",
      params: { id: String(e) }
    });
 }
  
//`/(productos)/producto/${e}`
  return (
    <ThemedView 
      style={{
        flex: 1,
        backgroundColor: '#F9F9F9',
        margin: 3,
        borderRadius: 5,
        overflow: 'hidden',
        padding: 5,
      }}
    >
      
      <TouchableOpacity onPress={() =>handlePress(product.id)}>
        
        {product.images.length === 0 ? (
          <Image
            source={require('../assets/images/no-product-image.png')}
            style={{ width: '100%', height: 200 }}
          />
        ) : (
          <Image
            source={{ uri: 'https://products.desarrollosweb.net.ar/tiendas/'+  product.images[0] }}
            style={{ flex: 1, height: 200, width: '100%' }}
          />
        )}

        <ThemedText
          numberOfLines={2}
          style={{ textAlign: 'center' }}
          darkColor={'black'}
        >
          {product.id}-{product.title}
        </ThemedText>
      </TouchableOpacity>

    </ThemedView>
  );
};
