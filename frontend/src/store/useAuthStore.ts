import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';
import type { AuthUser } from '../types'; // 1. Importamos o tipo centralizado

interface AuthState {
  token: string | null;
  user: AuthUser | null; // 2. Substituímos a tipagem manual pelo AuthUser
  setAuth: (token: string, user: AuthUser) => void; // 3. Fim do 'any'
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
        // Limpa o token do Axios ao sair
        delete api.defaults.headers.common['Authorization'];
        set({ token: null, user: null });
      },
    }),
    {
      // Nome da chave que será salva no LocalStorage
      name: '@OrbitalNeo:auth-store', 
    }
  )
);