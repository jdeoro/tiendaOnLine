import { getProduct, getProducts } from "@/src/actions/product-actions";
import { create } from "zustand";
import { CartItem } from "../interfaces/data";

export interface Product {
  //propiedades
  pageActual: number;
  totalPage: number;
  quantitySelectedProducts: number;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  getCartItems: () => CartItem[];
  addToCart: (item: CartItem) => void;



  //metodos
  ProductsList: (desde: number, hasta: number) => Promise<any>;
  ProducData: (id: number) => Promise<any>;
  setPage: (page: number) => void;
  setTotalPage: (totalPage: number) => void;
  SetSelectedProducts: (quantity: number) => void;
}

export const useProductStore = create<Product>()((set, get) => ({
  pageActual: 0,
  totalPage: 0,
  quantitySelectedProducts: 0,
  cartItems: [],
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
  setCartItems: (items) => set({ cartItems: items }),


  getCartItems: () => get().cartItems.map(item => ({
    ...item,
    images: item.images || "",
  })),

 addToCart: (newItem) => {
    const currentItems = get().cartItems;

    const exists = currentItems.find(
      (item) =>
        item.idprod === newItem.idprod && item.size === newItem.size
    );

    if (exists) {
      const updatedItems = currentItems.map((item) =>
        item.idprod === newItem.idprod && item.size === newItem.size
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item
      );
      set({ cartItems: updatedItems });
    } else {
      set({ cartItems: [...currentItems, newItem] });
    }
  },


}));
