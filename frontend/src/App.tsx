import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ClientPage } from "./pages/ClientPage";

function App() {
  const path = window.location.pathname;

  if (path === "/register") return <RegisterPage />;
  if (path === "/admin") return <OrdersPage />;
  if (path === "/client") return <ClientPage />;

  return <LoginPage />;
}

export default App;
