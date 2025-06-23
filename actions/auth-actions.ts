import { api_url } from '../api/api.connect';
import { User } from '../interfaces/User';

export interface AuthResponse {
  ok: boolean;
  msg: string;
  data: {
    fullname: string;
    id: number;
    role: number;
    afiliado: string;
    apellido: string;
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
    descrip: string;
  };
  token: string;
 
}

const returnUserToken = ( data: AuthResponse  ): User  => {
  const { token , ok , msg,data : datosPersonales} = data;
  return {
    ok,
    msg,
    token,
    data: datosPersonales,
  };
};


export const authLogin = async (email: string, pas: string) => {
  email = email.toLowerCase();
  try { 
    const { data } = await api_url.post<AuthResponse>('/login', {
      email,
      pas,
    });
    return returnUserToken(data);
    
  } catch (error) {
    console.log(error);
    // throw new Error('User and/or password not valid');
    return null;
  }
};

export const authCheckStatus = async () => {
  try {
    const { data } = await api_url.get<AuthResponse>('/check-status');
    return returnUserToken(data);
  } catch (error) {
    return null;
  }
};

export const authRegister = async (email: string, pas: string , fullname : string ) => {
  email = email.toLowerCase();

  try {
    const { data } = await api_url.post<AuthResponse>('/register', { email,pas, fullname });

    return returnUserToken(data);
    
  } catch (error) {
    console.log(error);
    // throw new Error('User and/or password not valid');
    return null;
  }
};