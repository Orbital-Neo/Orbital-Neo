import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const message = localStorage.getItem("registerMessage");
    if (message) {
      setSuccessMessage(message);
      localStorage.removeItem("registerMessage");
    }
  }, []);

  async function handleLogin() {
    setError("");
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      const isAdminUser =
        email === "operador@orbital.com" && password === "orbital123";

      const authPayload = {
        ...response,
        user: {
          ...response.user,
          role: isAdminUser ? "admin" : response.user.role,
        },
      };

      localStorage.setItem("auth", JSON.stringify(authPayload));

      const destination = isAdminUser ? "/admin" : "/client";
      navigate(destination, { replace: true });
      window.location.href = destination;
    } catch {
      setError("Falha no login. Verifique seus dados.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-80">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" className="w-16 mb-2" />
          <h2 className="text-xl font-bold">Login</h2>
        </div>

        {successMessage && (
          <div className="mb-3 text-green-600 text-sm">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="password"
          value={password}
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-60"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-sm mt-3 text-center">
          Não tem conta?{" "}
          <Link to="/register" className="text-orange-500">
            Cadastrar
          </Link>
        </p>
      </div>
    </div>
  );
}