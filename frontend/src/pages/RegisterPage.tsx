import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { authService } from "../services/api";

// 2. Extração da validação (Responsabilidade Única)
function validateRegister(name: string, phone: string, email: string, password: string) {
  if (!name || !phone || !email || !password) return "Preencha todos os campos.";
  if (password.length < 6) return "A senha deve ter no mínimo 6 caracteres.";
  return null;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 3. Assinatura do form com preventDefault nativo
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); 
    setError("");

    const validationError = validateRegister(name, phone, email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        name,
        phone,
        email,
        password,
      });

      localStorage.setItem("registerMessage", "Conta criada com sucesso! Faça login.");
      navigate("/login");
      
    // 1. Remoção do "any" e uso do Type Guard do Axios
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Erro ao cadastrar. Verifique os dados.");
      } else {
        setError("Erro inesperado. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Criar conta</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* JSX limpo */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Telefone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="(xx) xxxxx-xxxx"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:bg-slate-300 mt-4"
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Já tem conta?{" "}
          <Link to="/login" className="text-orange-500 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}