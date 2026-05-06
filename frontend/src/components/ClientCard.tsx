export function ClientCard({
  items,
  onRemove,
  phone,
  onPhoneChange,
  orderType,
  onOrderTypeChange,
  notes,
  onNotesChange,
  onCheckout,
  isSending,
}: any) {
  const total = items.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-blue-900 text-lg">Carrinho</h2>
        <span className="text-sm text-slate-500">{items.length} itens</span>
      </div>

      {items.length === 0 ? (
        <p className="text-slate-600 mb-4">Seu carrinho está vazio.</p>
      ) : (
        items.map((item: any) => (
          <div key={item.id} className="mb-3 border-b pb-2">
            <p className="text-gray-800 font-semibold">{item.name}</p>
            <p className="text-sm text-gray-500">
              {item.quantity}x R$ {item.price}
            </p>
            <button
              onClick={() => onRemove(item.id)}
              className="text-red-500 text-xs"
            >
              Remover
            </button>
          </div>
        ))
      )}

      <div className="mt-4 space-y-4">
        <label className="block text-sm text-slate-600">Telefone de contato</label>
        <input
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value)}
          placeholder="(xx) xxxxx-xxxx"
          className="w-full rounded-2xl border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <label className="block text-sm text-slate-600">Tipo de pedido</label>
        <select
          value={orderType}
          onChange={(event) => onOrderTypeChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="delivery">Entrega</option>
          <option value="retirada">Retirada</option>
        </select>

        <label className="block text-sm text-slate-600">Observações</label>
        <textarea
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="Ex: sem cebola, sem lactose..."
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <div className="mt-4 font-bold text-orange-500">
          Total: R$ {total}
        </div>

        <button
          onClick={onCheckout}
          disabled={isSending || items.length === 0}
          className="w-full mt-3 rounded-2xl bg-blue-900 text-white py-3 font-semibold hover:bg-blue-800 disabled:opacity-60 transition"
        >
          {isSending ? "Enviando pedido..." : "Fazer pedido"}
        </button>
      </div>
    </div>
  );
}
