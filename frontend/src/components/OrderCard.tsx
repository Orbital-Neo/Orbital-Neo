type OrderCardProps = {
  name: string;
  orderId: string;
  status: string;
  time?: string;
  items: {
    name: string;
    quantity: number;
  }[];
  footer?: string;
  total?: number;
};

export function OrderCard({ name, orderId, status, time, items, footer, total }: OrderCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="text-xs font-semibold text-blue-600">#{orderId}</p>
          <h3 className="font-semibold text-gray-800 mt-2">{name}</h3>
          {time ? (
            <p className="text-xs text-slate-500 mt-1">{time}</p>
          ) : null}
        </div>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          {status}
        </span>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        {items.map((item, index) => (
          <p key={index}>
            {item.quantity}x {item.name}
          </p>
        ))}
      </div>

      {total != null ? (
        <div className="mt-3 text-slate-700 text-sm font-semibold">
          Total: R$ {total}
        </div>
      ) : null}

      {footer ? (
        <div className="mt-3 text-red-500 text-sm font-medium">{footer}</div>
      ) : null}
    </div>
  );
}
