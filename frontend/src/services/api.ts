import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://orbital-neo.onrender.com",
  timeout: 10000,
});

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "cliente";
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  size: string;
  price: number;
  available: boolean;
  imageUrl: string | null;
};

export type OrderItemPayload = {
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
};

export type CreateOrderPayload = {
  customerName: string;
  customerPhone: string;
  type: "delivery" | "retirada";
  items: OrderItemPayload[];
  notes?: string;
};

function authHeaders(token?: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export async function register(payload: {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: "admin" | "cliente";
}) {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
}

export async function login(payload: { email: string; password: string }) {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function getMenu() {
  const response = await api.get<MenuItem[]>("/menu");
  return response.data;
}

export async function createOrder(payload: CreateOrderPayload, token?: string | null) {
  const response = await api.post("/orders", payload, {
    headers: authHeaders(token),
  });
  return response.data;
}

export async function getOrders(token?: string | null) {
  const response = await api.get("/orders", {
    headers: authHeaders(token),
  });
  return response.data;
}

export async function updateOrderStatus(orderId: string, status: string, token?: string | null) {
  const response = await api.patch(`/orders/${orderId}/status`, { status }, {
    headers: authHeaders(token),
  });
  return response.data;
}
