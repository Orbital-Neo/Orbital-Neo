import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ClientPage } from "./pages/ClientPage";

function getAuth() {
  const stored = localStorage.getItem("auth");
  return stored ? JSON.parse(stored) : null;
}

function App() {
  const auth = getAuth();
  const isAdmin = auth?.user?.role === "admin";

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/"
          element={
            auth ? (
              <Navigate to={isAdmin ? "/admin" : "/client"} replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* CADASTRO */}
        <Route path="/register" element={<RegisterPage />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={isAdmin ? <OrdersPage /> : <Navigate to="/" replace />}
        />

        {/* CLIENT */}
        <Route
          path="/client"
          element={auth ? <ClientPage /> : <Navigate to="/" replace />}
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;