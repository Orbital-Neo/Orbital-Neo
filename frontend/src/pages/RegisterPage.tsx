import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";

type UserRole = "admin" | "cliente";

export function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("cliente");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    setError("");
    setIsLoading(true);

    if (!name || !phone || !email || !password) {
      setError("Preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    try {
      await register({
        name,
        phone,
        email,
        password,
        role,
      });

      const message = "Conta criada com sucesso. Faça login.";

      localStorage.setItem("registerMessage", message);

      navigate("/");
    } catch {
      setError("Erro ao cadastrar.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-80">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" className="w-16 mb-2" />
          <h2 className="text-xl font-bold">Criar conta</h2>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
        />

        <input
          placeholder="Telefone"
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full mb-3 px-3 py-2 border rounded"
        >
          <option value="cliente">Cliente</option>
          <option value="admin">Administrador</option>
        </select>

        <button
          onClick={handleRegister}
          className="w-full bg-orange-500 text-white py-2 rounded"
        >
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <p className="text-sm mt-3 text-center">
          Já tem conta?{" "}
          <Link to="/" className="text-orange-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}