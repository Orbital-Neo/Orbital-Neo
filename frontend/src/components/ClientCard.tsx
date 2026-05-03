export function ClientCard({ items, onRemove }: any) {
  const total = items.reduce(
    (acc: number, item: any) =>
      acc + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2 className="font-bold text-blue-900 mb-4">
        Carrinho
      </h2>

      {items.map((item: any, index: number) => (
        <div key={index} className="mb-3 border-b pb-2">
          <p className="text-gray-800">
            {item.name}
          </p>

          <p className="text-sm text-gray-500">
            {item.quantity}x R$ {item.price}
          </p>

          <button
            onClick={() => onRemove(item.name)}
            className="text-red-500 text-xs"
          >
            Remover
          </button>
        </div>
      ))}

      <div className="mt-4 font-bold text-orange-500">
        Total: R$ {total}
      </div>

      <button className="mt-4 w-full bg-blue-900 text-white py-2 rounded">
        Fazer pedido
      </button>
    </div>
  );
}