import { OrderCard } from "./OrderCard";

type ColumnProps = {
  title: string;
};

export function KanbanColumn({ title }: ColumnProps) {
  return (
    <div className="flex-1 min-w-[250px]">
      <h2 className="text-white mb-3">{title}</h2>

      <div className="flex flex-col gap-3">
        <OrderCard name="Ana Souza" orderId="1042" time="37 min" />
        <OrderCard name="Mariana Costa" orderId="1038" time="12 min" />
      </div>
    </div>
  );
}