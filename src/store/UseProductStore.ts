import { getProduct, getProducts, setPedido } from "@/src/actions/product-actions";
import { create } from "zustand";
import { CartItem, EstadoPedido, OrderData, OrderDetail } from "../interfaces/data";


// Definición de tipos para la respuesta exitosa del backend al crear un pedido
interface CreateOrderSuccessResponse {
  ok: boolean;
  msg: string;
  id_pedido: number;
  detalles_insertados: number;
}

// Definición de tipos para la respuesta de error del backend
interface CreateOrderErrorResponse {
  ok: boolean;
  msg: string;
  error?: string; // Opcional, si tu backend envía más detalles del error
}

export interface Product {
  //propiedades
  pageActual: number;
  totalPage: number;
  quantitySelectedProducts: number;  // productos seleccionados.
  loading: boolean;
  error: string | null;
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
  
  // Acciones
  placeOrder: () => Promise<number>; // Ya no necesita backendUrl como argumento  
  
}

export const useProductStore = create<Product>()((set, get) => ({
  pageActual: 0,
  totalPage: 0,
  quantitySelectedProducts: 0,
  cartItems: [],
  loading: false,
  error: null,  
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

  placeOrder: async () => { // Ya no recibe backendUrl, usa api_url directamente
    // Obtener los items del carrito usando el método getCartItems() de tu store
    const cartItems = get().getCartItems(); 

    if (cartItems.length === 0) {
      set({ error: 'El carrito está vacío. Agrega productos antes de realizar un pedido.' });
      return Promise.reject('El carrito está vacío.'); // Rechaza la promesa si el carrito está vacío
    }

    set({ loading: true, error: null }); // Iniciar carga y limpiar errores previos

    // 1. Transformar los datos del carrito al formato esperado por el backend (detalles del pedido)
    const orderDetails: OrderDetail[] = cartItems.map(item => ({
      id_producto: item.idprod,
      cantidad: item.quantity,
      precio_unitario: parseFloat(item.price) // Asegúrate de convertir el precio a número
    }));

    // 2. Preparar la fecha actual y la fecha de entrega (ejemplo: mañana)
    const now = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(now.getDate() + 1); // Entrega para mañana

    // Formatear las fechas a 'YYYY-MM-DD HH:MM:SS' para MySQL
    const formatDateTime = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const fechaPedido = formatDateTime(now);
    const fechaEntrega = formatDateTime(deliveryDate);

    // 3. Construir el objeto del pedido completo
    const orderData: OrderData = { // Se especifica el tipo OrderData
      fecha: fechaPedido,
      observaciones: 'Pedido realizado desde la aplicación móvil.',
      estado: EstadoPedido.pendiente, //
      fecha_entrega: fechaEntrega, // Asumo que fechaEntrega es compatible con fechaEntrega del enum o un string
      detalles: orderDetails
    };

    try {
      // Usar api_url.post para enviar la solicitud
      const result = await setPedido(orderData);

      if (result.ok) { // Si el backend responde con ok: true
        set({ loading: false, error: null });
        // Limpia el carrito después de un pedido exitoso usando tu método existente
        get().deleteItems(); 

        // Retorna el id_pedido
        return Promise.resolve(result.id_pedido); 
      } else {
        // Si el backend responde con ok: false
        set({ loading: false, error: result.msg || 'Hubo un problema al realizar el pedido.' });
        return Promise.reject(result.msg || 'Hubo un problema al realizar el pedido.');
      }
    } catch (error: any) {
      console.error('Error al conectar con el servidor o al realizar el pedido:', error);
      let errorMessage = 'Error de Conexión: No se pudo conectar con el servidor.';
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        const errorData: CreateOrderErrorResponse = error.response.data;
        errorMessage = errorData.msg || `Error del servidor: ${error.response.status}`;
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión.';
      } else {
        // Algo más causó el error
        errorMessage = error.message;
      }
      set({ loading: false, error: errorMessage });
      return Promise.reject(errorMessage);
    }
  },  

}));
