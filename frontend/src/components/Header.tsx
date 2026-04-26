export function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-orange-500 text-white shadow-lg">
      <div>
        <h2 className="text-2xl font-bold">Fluxo de pedidos</h2>
        <p className="text-sm text-orange-100">
          Acompanhe cada pedido em tempo real
        </p>
      </div>

      <div className="flex gap-3">
        <input
          placeholder="Buscar..."
          className="bg-white px-4 py-2 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-semibold transition shadow">
          + Novo pedido
        </button>
      </div>
    </header>
  );
}