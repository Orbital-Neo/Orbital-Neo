import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { OrdersPage } from "./pages/OrdersPage"; 
import { ClientPage } from "./pages/ClientPage";

function App() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rota Protegida do Operador (Dashboard/Kanban) */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRole="operador">
            <OrdersPage />
          </ProtectedRoute>
        } 
      />

      {/* Rota Protegida do Cliente (Menu) */}
      <Route 
        path="/client" 
        element={
          <ProtectedRoute allowedRole="cliente">
            <ClientPage />
          </ProtectedRoute>
        } 
      />

      {/* Redirecionamentos de Segurança */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;