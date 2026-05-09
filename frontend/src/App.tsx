import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Importação das Páginas
import {LoginPage} from "./pages/LoginPage";
import {RegisterPage} from "./pages/RegisterPage";
import {OrdersPage} from "./pages/OrdersPage";
import {ClientPage} from "./pages/ClientPage";
import {DashboardPage} from "./pages/DashboardPage.tsx";

/**
 * Componente de Layout Privado
 * Define a estrutura visual com Sidebar e Header presente em todas as telas internas.
 */
function PrivateLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar fixa à esquerda conforme o design da Fabyola */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header superior com informações de contexto[cite: 1] */}
        <Header />
        
        {/* Conteúdo dinâmico das páginas protegidas */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas Protegidas para Operador */}
      <Route element={<ProtectedRoute allowedRoles={['operador']} />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pedidos" element={<OrdersPage />} />
        </Route>
      </Route>

      {/* Rotas Protegidas para Cliente */}
      <Route element={<ProtectedRoute allowedRoles={['cliente']} />}>
        <Route path="/menu" element={<ClientPage />} />
        <Route path="/dashboard" element={<Navigate to="/menu" replace />} />
      </Route>

      {/* Redirecionamento padrão para evitar telas brancas */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </>
  );
}