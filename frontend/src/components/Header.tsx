export function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-orange-500 text-white shadow-lg">
      <div className="flex items-center gap-3">
            <img
                src="/logo.png"
                alt="Logo da OrbitalNeo"
                className="w-10 h-10 object-contain p-1"
            />
            <div>
                <h2 className="text-2xl font-bold">Fluxo de pedidos</h2>
                <p className="text-sm text-orange-100">
                  Acompanhe cada pedido em tempo real
                </p>
            </div>
        </div>
    
      

      <div className="flex gap-3">
        <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-semibold transition shadow">
          Sair
        </button>
      </div>
    </header>
  );
}