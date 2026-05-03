import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api'; // Importe sua api para gerenciar o token

interface AuthState {
  token: string | null;
  user: {
    nome: string;
    role: 'cliente' | 'operador';
  } | null;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        // Ao logar, já avisa o Axios para usar este token nas próximas chamadas
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ token, user });
      },
      logout: () => {
        // Ao deslogar, limpa o token e as informações
        delete api.defaults.headers.common['Authorization'];
        set({ token: null, user: null });
      },
    }),
    { name: 'auth-storage' }
  )
);