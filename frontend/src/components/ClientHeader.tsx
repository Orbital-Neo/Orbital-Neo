type Props = {
  onToggleCart: () => void;
  onLogout?: () => void;
};

export function ClientHeader({ onToggleCart, onLogout }: Props) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    localStorage.removeItem("auth");
    window.location.href = "/";
  };

  return (
    <header className="flex justify-between items-center p-4 bg-orange-500 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Logo da OrbitalNeo"
          className="w-10 h-10 object-contain p-1"
        />

        <div>
          <h2 className="text-2xl font-bold leading-none">Orbital Neo</h2>
          <p className="text-sm text-orange-100">Peça sua pizza favorita</p>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <button
          onClick={onToggleCart}
          className="bg-white text-orange-500 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition shadow"
        >
          🛒 Carrinho
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-semibold transition shadow"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
