import { OrderCard } from "./OrderCard";
import  type { Order } from "../types";

type ColumnProps = {
  id: string; 
  title: string;
  pedidos: Order[]; 
};

export function KanbanColumn({ title, pedidos }: ColumnProps) {
  return (
    <div className="flex-1 min-w-[250px]">
      <h2 className="text-orange-500 mb-3 font-bold">{title}</h2>

      <div className="flex flex-col gap-3">
        {pedidos.map((pedido) => (
          <OrderCard
            key={pedido.id}
            id={String(pedido.id)}
            name={pedido.customerName}
            orderId={pedido.id}
            status={pedido.status}
            items={pedido.items}
            total={pedido.total}
          />
        ))}

        {pedidos.length === 0 && (
          <p className="text-gray-400 text-sm italic">Nenhum pedido nesta etapa.</p>
        )}
      </div>
    </div>
  );
}