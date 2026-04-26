type OrderCardProps = {
  name: string;
  orderId: string;
  time: string;
  items: {
    name: string;
    quantity: number;
  }[];
};

export function OrderCard({ name, orderId, time, items }: OrderCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition">
      <p className="text-xs font-semibold text-blue-600">#{orderId}</p>

      <h3 className="font-semibold text-gray-800 mt-2">{name}</h3>

      {/* 🧾 Itens do pedido */}
      <div className="mt-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <p key={index}>
            {item.quantity}x {item.name}
          </p>
        ))}
      </div>

      <div className="mt-3 text-red-500 text-sm font-medium">
        {time} restantes
      </div>
    </div>
  );
}