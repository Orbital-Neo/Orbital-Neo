import { useState } from "react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (email === user.email && password === user.password) {
      if (user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/client";
      }
    } else {
      alert("Login inválido");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-80">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" className="w-16 mb-2" />
          <h2 className="text-xl font-bold text-gray-800">Login</h2>
        </div>

        {/* INPUT EMAIL */}
        <input
          placeholder="Email"
          className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* INPUT SENHA */}
        <input
          type="password"
          placeholder="Senha"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BOTÃO */}
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
        >
          Entrar
        </button>

        {/* LINK CADASTRO */}
        <p className="text-sm mt-4 text-center text-gray-600">
          Não tem conta?{" "}
          <a href="/register" className="text-orange-500 font-medium">
            Cadastrar
          </a>
        </p>
      </div>
    </div>
  );
}