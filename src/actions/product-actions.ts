import { api_url } from "@/src/api/api.connect";
import { Data } from "@/src/interfaces/data";
import { Dataproduct } from "@/src/interfaces/product";

export const getProducts = async ( desde : number , hasta : number ) => {

  try {
    const {data} = await api_url.get<Data>('/productos',{
      params: {
        desde,
        hasta
      }
    })

    if (!data.ok ) {
      console.log('no products found');
      return []
    }
    
    if (!data){
      console.log('failed fetching data');
      return []
    }

    return data
    //.productos
    //result.data.productos;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
    
  }
}   


export const getProduct = async ( id : number ) => {

  try {
    const {data} = await api_url.get<Dataproduct>('/producto',{
      params: {
        id
      }
    })

    if (!data.ok ) {
      console.log('no products found');
      return []
    }
    
    if (!data){
      console.log('failed fetching data');
      return []
    }

    return data
    //.productos
    //result.data.productos;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
    
  }
}   