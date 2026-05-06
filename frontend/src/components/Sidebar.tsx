export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-blue-900 text-white p-6 shadow-lg">
      <h1 className="text-2xl font-bold mb-8 text-white">Orbital Neo</h1>

      <nav className="flex flex-col gap-2">
        <button className="text-left bg-red-500 hover:bg-red-600 p-3 rounded font-semibold transition">
          Pedidos
        </button>

        <button className="text-left p-3 hover:bg-blue-800 rounded transition text-blue-100">
          Dashboard
        </button>

        <button className="text-left p-3 hover:bg-blue-800 rounded transition text-blue-100">
          Busca
        </button>
      </nav>
    </aside>
  );
}