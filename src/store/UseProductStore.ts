import { getProduct, getProducts } from '@/src/actions/product-actions';
import { create } from 'zustand';

export interface Product {
   //propiedades
   pageActual : number;
   totalPage: number;
   quantitySelectedProducts: number ;  
   
   //metodos
   ProductsList: ( desde : number , hasta:number) => Promise<any>;
   ProducData : ( id : number) => Promise<any>;

   setPage : ( page : number) => void;
   setTotalPage : ( totalPage : number ) => void;
    SetSelectedProducts: ( quantity : number ) => void;
}

export const useProductStore = create<Product>()((set, get) => ({
  pageActual: 0,
  totalPage: 0,
quantitySelectedProducts: 0,
  ProductsList: async (desde: number, hasta: number) => {
    const response = await getProducts(desde, hasta);

    if (!response) {
      throw new Error("No products found");
    }

    return response;
  },

  ProducData: async (id: number) => {
    const response = await getProduct(id);
    if (!response) {
      throw new Error("No product found");
    }

    return response;
  },

  setPage: (page: number) => set(() => ({ pageActual: page })),
  setTotalPage: (totalPage: number) => set(() => ({ totalPage: totalPage })),  
  SetSelectedProducts(quantity) {
    set(() => ({ quantitySelectedProducts: quantity }));
  }, 
  
}));
