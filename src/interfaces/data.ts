export interface Data {
    ok:        boolean;
    msg:       string;
    reg:       number;
    paginas:   number;
    pagina:    number;
    productos: Producto[];
}

export interface Producto {
    id:            number;
    title:         string;
    price:         string;
    descripcion:   string;
    stock:         number;
    sizes:         Size[];
    gender:        Gender;
    category:      Category;
    images:        string[];
    total_records: number;
}

export enum Category {
    Remeras = "Remeras",
}

export interface CartItem {
  idprod: number;
  title: string;
  price: string;
  size: Size | null;
  images: string;
  quantity: number;
}

export enum Gender {
    Men = "men",
    Unisex = "unisex",
}

export enum Size {
    L = "L",
    M = "M",
    S = "S",
    Xl = "XL",
    Xxl = "XXL",
}

export interface  CreateOrders {
    ok: boolean,
    msg: string,
    id_pedido: number,
    detalles_insertados: number
}


export interface OrderData {
     fecha: string,
      observaciones: string,
      estado: EstadoPedido,
      fecha_entrega: fechaEntrega,
      detalles: OrderDetail[]
}

// Definición de tipos para los detalles del pedido que se envían al backend
export interface OrderDetail {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
}

export enum EstadoPedido {
    pendiente ='pendiente', 
    entregado = 'entregado',
    cancelado = 'cancelado',
    indefinido =  ''    
}

// export interface Data {
//     ok:        boolean;
//     msg:       string;
//     reg:       number;
//     productos: Producto[];
// }

// export interface Producto {
//     id:          number;
//     title:       string;
//     price:       string;
//     descripcion: string;
//     stock:       number;
//     sizes:       Size[];
//     gender:      Gender;
//     category:    Category;
//     images:      string[];
// }

// export enum Category {
//     Remeras = "Remeras",
// }

// export enum Gender {
//     Men = "men",
//     Unisex = "unisex",
// }

// export enum Size {
//     L = "L",
//     M = "M",
//     S = "S",
//     Xl = "XL",
//     Xxl = "XXL",
// }
