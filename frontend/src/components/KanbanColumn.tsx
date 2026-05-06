import { OrderCard } from "./OrderCard";

type ColumnProps = {
  title: string;
};

export function KanbanColumn({ title }: ColumnProps) {
  return (
    <div className="flex-1 min-w-[250px]">
      <h2 className="text-orange-500 mb-3">{title}</h2>

      <div className="flex flex-col gap-3">
        <OrderCard
          id="1"
          name="Ana Souza"
          orderId="1042"
          status="Recebido"
          time="37 min"
          items={[
            { name: "Pizza", quantity: 1 },
            { name: "Suco", quantity: 2 },
          ]}
        />

        <OrderCard
          id="2"
          name="Mariana Costa"
          orderId="1038"
          status="Em preparo"
          time="12 min"
          items={[
            { name: "Hambúrguer", quantity: 1 },
            { name: "Refrigerante", quantity: 1 },
          ]}
        />
      </div>
    </div>
  );
}