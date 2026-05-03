export function ClientInfo() {
  return (
    <div className="relative h-80 w-full overflow-hidden">
      {/* imagem de fundo */}
      <img
        src="./bg.png"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* overlay escuro */}
      <div className="absolute inset-0 bg-black/55" />

      {/* conteúdo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-white">
        <h1 className="text-4xl font-bold leading-tight">
          Orbital <span className="text-orange-500">Neo</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-100 max-w-2xl">
          🍕 As melhores pizzas da cidade, entregues quentinhas e com sabor que conquista.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-200">
          <span>⏰ 18:00 - 23:00</span>
          <span>🚚 Entrega em ~40 min</span>
          <span>📍 Raio de 3 km</span>
        </div>
      </div>
    </div>
  );
}