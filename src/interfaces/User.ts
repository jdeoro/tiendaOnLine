export interface User {
  ok: boolean;
  msg: string;
  data : {
    fullname : string;
    id: number
    role: number;
    afiliado : string;
    apellido : string;
    nombre: string;    
    codpos: string;
    descripcion: string;
    domicilio: string;
    estado: number;
    fecnac: string;
    localidad: string;
    nrodoc: string;
    sexo: string;
    tel: string;
    descrip:string    
  } 
  token: string;
}

