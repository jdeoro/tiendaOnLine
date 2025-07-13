import { SecureStorageAdapter } from '@/src/middelware/secure-storage';
import { create } from 'zustand';
import { authCheckStatus, authLogin, authRegister } from '../actions/auth-actions';
import { User } from '../interfaces/User';
import { useProductStore } from './UseProductStore';
//import { SecureStorageAdapter } from '@/helpers/adapters/secure-storage.adapter';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking';

export interface AuthState {
  estado: AuthStatus;
  token?: string;
  user?: User;

  login: (email: string, password: string) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;
  changeStatus: (user?: User ) => Promise<boolean>;
  register :  (email: string, password: string, fullname : string ) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Properties
  estado: "checking",
  token: undefined,
  user: undefined,

  // Actions
  login: async (email: string, password: string) => {
    //const token = await SecureStorageAdapter.getItem('token');
    const resp = await authLogin(email, password);

    if (!resp) {
      console.log("Error en login: No se obtuvo respuesta del servidor");
      return false;
    } else {
      return get().changeStatus(resp);
    }
  },

  changeStatus: async (user?: User) => {
    //console.log("Ejecutando changeStatus()")

    if (!user || !user.ok) {
      set({
        estado: "unauthenticated",
        token: undefined,
        user: undefined,
      });
      await SecureStorageAdapter.deleteItem("token");
      return false;
    }
    // Sí hay token y usuario

    set({
      estado: "authenticated",
      token: user.token,
      user: user,
    });
    await SecureStorageAdapter.setItem("token", user.token);
    const tokengrabado = await SecureStorageAdapter.getItem("token");
    return true;
  },

  checkStatus: async () => {
    const resp = await authCheckStatus();
    get().changeStatus(resp ?? undefined);
  },

  logout: async () => {
    SecureStorageAdapter.deleteItem("token");

    get().changeStatus(undefined);
    set({ estado: "unauthenticated", token: undefined, user: undefined });
    useProductStore.getState().deleteItems(); // Elimina los items del carrito de compras
  },

  register: async (email: string, password: string, fullname: string) => {
    const resp = await authRegister(email, password, fullname);

    if (!resp) {
      console.log("Error en login: No se obtuvo respuesta del servidor");
      return false;
    } else {
      return get().changeStatus(resp);
    }
  },
}));

