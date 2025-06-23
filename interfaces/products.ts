export interface Products {
    msg:  string;
    ok:   boolean;
    reg:  number;
    productos: Data[];
}

export interface Data {
    id:          number;
    title:       string;
    price:       string;
    descripcion: string;
    stock:       number;
    sizes:       string[];
    gender:      string;
    category:    string;
    images:      string[];
}

