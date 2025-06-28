
export interface Dataproduct {
    ok:       boolean;
    msg:      string;
    producto: Producto;
}

export interface Producto {
    id:          number;
    title:       string;
    price:       string;
    descripcion: string;
    stock:       number;
    gender:      string;
    category:    string;
    sizes:       string[];
    images:      string[];
}
