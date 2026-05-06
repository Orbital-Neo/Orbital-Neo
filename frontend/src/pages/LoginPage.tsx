import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { authService } from "../services/api";
import { useAuthStore } from "../store/useAuthStore"; // 1. IMPORTAÇÃO DO ZUSTAND

function validateLogin(email: string, password: string) {
  if (!email || !password) return "E-mail e senha são obrigatórios.";
  return null;
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState(() => {
    return localStorage.getItem("registerMessage") || "";
  });

  const navigate = useNavigate();
  
  // 2. PEGANDO A FUNÇÃO DE SALVAR DO ESTADO GLOBAL
  const setAuth = useAuthStore((state) => state.setAuth); 

  useEffect(() => {
    if (successMessage) {
      localStorage.removeItem("registerMessage");
    }
  }, [successMessage]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const validationError = validateLogin(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });

      // 3. A MÁGICA QUE RESOLVE O LOOP: Salvando no Zustand!
      setAuth(response.token, response.user);

      // (Opcional) Mantemos no localStorage legado apenas por precaução
      localStorage.setItem("@OrbitalNeo:token", response.token);
      localStorage.setItem("@OrbitalNeo:user", JSON.stringify(response.user));

      // 4. Redirecionamento correto
      if (response.user.role === "operador") {
        navigate("/pedidos");
      } else {
        navigate("/menu");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "E-mail ou senha inválidos.");
      } else {
        setError("Erro inesperado. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        {/* LAYOUT RESTAURADO: Logo e título centralizados */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img 
            src="/logo.png" 
            alt="Logo Orbital Neo" 
            className="w-20 h-20 mb-4 rounded-2xl shadow-sm object-cover" 
          />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Login</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* LAYOUT RESTAURADO: Botão laranja da marca */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-slate-300 mt-4"
          >
            {isLoading ? "Validando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Não tem conta?{" "}
          {/* LAYOUT RESTAURADO: Texto do link no padrão antigo */}
          <Link to="/register" className="text-orange-500 font-bold hover:underline">
            Cadastrar
          </Link>
        </p>
      </div>
    </div>
  );
}