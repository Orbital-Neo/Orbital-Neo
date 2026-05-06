import axios from "axios";
import type { 
  LoginDTO, 
  RegisterDTO, 
  AuthResponse, 
  CreateOrderDTO, 
  Order, 
  MenuItem 
} from "../types";

// Configuração da instância principal do Axios
export const api = axios.create({
  // URL base do seu backend Fastify (ajuste se a porta for diferente)
  baseURL: "http://localhost:3333", 
  timeout: 10000,
});

// Interceptor: Injeta o token em todas as requisições que precisarem de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@OrbitalNeo:token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agrupamento de serviços por domínio (Auth, Pedidos, Menu)
export const authService = {
  login: async (data: LoginDTO) => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },
  
  register: async (data: RegisterDTO) => {
    // O envio não inclui mais a role, alinhado com o backend
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },
};

export const pedidosService = {
  list: async () => {
    const response = await api.get<Order[]>("/orders");
    return response.data;
  },
  
  create: async (data: CreateOrderDTO) => {
    const response = await api.post<Order>("/orders", data);
    return response.data;
  },
  
  updateStatus: async (id: string | number, status: string) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
};

export const menuService = {
  getMenu: async () => {
    const response = await api.get<MenuItem[]>("/menu");
    return response.data;
  },
};