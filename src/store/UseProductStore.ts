import { getProduct, getProducts } from "@/src/actions/product-actions";
import { create } from "zustand";
import { CartItem } from "../interfaces/data";

export interface Product {
  //propiedades
  pageActual: number;
  totalPage: number;
  quantitySelectedProducts: number;  // productos seleccionados.
  cartItems: CartItem[];        // productos del carrito de compras

  setCartItems: (items: CartItem[]) => void; // establece los items del carrito de compras
  getCartItems: () => CartItem[]; // obtiene los items del carrito de compras
  addToCart: (item: CartItem) => void; // agrega un item al carrito de compras
  ProductsList: (desde: number, hasta: number) => Promise<any>;
  ProducData: (id: number) => Promise<any>;
  setPage: (page: number) => void;
  setTotalPage: (totalPage: number) => void;
  SetSelectedProducts: (quantity: number) => void;
  deleteItems : () => void; // elimina los items del carrito de compras
  editItems: (item: CartItem) => void; // edita un item del carrito de compras
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
    set((state) => ({
      quantitySelectedProducts: state.quantitySelectedProducts + quantity,
    }));
  },
  setCartItems: (items) => set({ cartItems: items }),

  getCartItems: () =>
    get().cartItems.map((item) => ({
      ...item,
      images: item.images || "",
    })),

  addToCart: (newItem) => {
    const currentItems = get().cartItems;

    const exists = currentItems.find(
      (item) => item.idprod === newItem.idprod && item.size === newItem.size
    );

    if (exists) {
      const updatedItems = currentItems.map((item) =>
        item.idprod === newItem.idprod && item.size === newItem.size
          ? { ...item,
             quantity: item.quantity + newItem.quantity,
            }
          : item
      );
      set({ cartItems: updatedItems });

      //console.log(`El producto ya existia: ${updatedItems.}`)

    } else {
      set({ cartItems: [...currentItems, newItem] });
    }
  },
  deleteItems: () => {
    set({ cartItems: [] });
    set({ quantitySelectedProducts: 0 });
  },

  editItems: (updatedItem) => {
    console.log("editItems called with:", updatedItem);
    const contador=0;


    set((state) => {
      let newCartItems;

      if (updatedItem.quantity === 0) {
        // Elimina el item si la cantidad es 0
        newCartItems = state.cartItems.filter(
          (item) =>
            !(
              item.idprod === updatedItem.idprod &&
              item.size === updatedItem.size
            )
        );
      } else {
        // Actualiza la cantidad si es mayor a 0
        newCartItems = state.cartItems.map((item) =>
          item.idprod === updatedItem.idprod && item.size === updatedItem.size
            ? { ...item, quantity: updatedItem.quantity }
            : item
        );
      }
        const totalQuantity = newCartItems.reduce((acumulador, item) => {
          return acumulador + item.quantity;
        }, 0);

      return {
        cartItems: newCartItems,
      
        quantitySelectedProducts: totalQuantity,
      };
    });
  },
}));
