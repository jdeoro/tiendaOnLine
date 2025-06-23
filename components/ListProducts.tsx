import { Producto } from "@/interfaces/data";
import { FlatList } from 'react-native';
import { ProductCard } from "./ProductCard";

interface Props {
  products: Producto[];
}

const ListProducts = ({ products}: Props) => {

  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => < ProductCard product={item} />}
      onEndReachedThreshold={0.8}
      showsVerticalScrollIndicator={false}
    />

  )
}

export default ListProducts