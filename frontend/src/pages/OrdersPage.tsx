import { useEffect, useMemo, useState } from "react";
import { OrderCard } from "../components/OrderCard";
import { pedidosService } from "../services/api"; 
import type { Order, OrderStatus } from "../types";
import { DndContext, type DragEndEvent, useDroppable } from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";

const STATUS_ORDER: OrderStatus[] = [
  "recebido",
  "em_preparo",
  "pronto",
  "saiu_para_entrega",
  "concluido",
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  recebido: "Recebido",
  em_preparo: "Em preparo",
  pronto: "Pronto",
  saiu_para_entrega: "Saiu para entrega",
  concluido: "Concluído",
};

const COLUMN_STYLES: Record<OrderStatus, string> = {
  recebido: 'bg-slate-50 border-slate-200 text-slate-900',
  em_preparo: 'bg-blue-50 border-blue-200 text-blue-900',
  pronto: 'bg-amber-50 border-amber-200 text-amber-900',
  saiu_para_entrega: 'bg-violet-50 border-violet-200 text-violet-900',
  concluido: 'bg-emerald-50 border-emerald-200 text-emerald-900',
};

function DroppableColumn({ status, children }: { status: OrderStatus; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[260px] rounded-lg border p-4 transition ${COLUMN_STYLES[status]} ${isOver ? 'ring-2 ring-offset-2 ring-orange-300' : ''}`}
    >
      {children}
    </div>
  );
}

export function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useMemo(() => {
    const authData = localStorage.getItem("@OrbitalNeo:user");
    return authData ? JSON.parse(authData) : null;
  }, []);

  useEffect(() => {
    if (!user || user.role !== "operador") {
      navigate("/login");
      return;
    }

    async function loadOrders() {
      try {
        setLoading(true);
        const backendOrders = await pedidosService.list();
        setOrders(backendOrders);
      } catch  {
        const fallbackOrders = JSON.parse(localStorage.getItem("localOrders") || "[]");
        setOrders(fallbackOrders);
        setError("Não foi possível carregar os pedidos do backend. Exibindo pedidos locais.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user, navigate]);

  /**
   * Lógica de movimentação entre colunas (Kanban)
   */

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const orderId = String(active.id);
    const newStatus = over.id as OrderStatus;

    const updatedOrders = orders.map((order) =>
      String(order.id) === orderId ? { ...order, status: newStatus } : order
    );

    setOrders(updatedOrders);
    localStorage.setItem("localOrders", JSON.stringify(updatedOrders));

    try {
      await pedidosService.updateStatus(orderId, newStatus);
    } catch {
      setError("Erro ao sincronizar status com o servidor.");
    }
  }

  const grouped = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = orders.filter((o) => o.status === status);
    return acc;
  }, {} as Record<OrderStatus, Order[]>);

  return (
    <main className="flex-1 overflow-hidden flex flex-col p-6">
          <div className="mb-6 flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-slate-900">Fluxo de Pedidos</h1>
            <p className="text-slate-500 text-sm">Gerencie o status da produção em tempo real.</p>
            
            {error && (
              <div className="mt-2 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full w-fit">
                ⚠️ {error}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 italic">
              Sincronizando pedidos...
            </div>
          ) : (
            <DndContext onDragEnd={handleDragEnd}>
              <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                {STATUS_ORDER.map((status) => (
                  <DroppableColumn key={status} status={status}>
                    <div className="flex items-center justify-between mb-4 px-2">
                      <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: status === 'recebido' ? '#0f172a' : status === 'em_preparo' ? '#1d4ed8' : status === 'pronto' ? '#92400e' : status === 'saiu_para_entrega' ? '#5b21b6' : '#166534' }}>
                        {STATUS_LABELS[status]}
                      </h2>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: status === 'recebido' ? '#e2e8f0' : status === 'em_preparo' ? '#dbeafe' : status === 'pronto' ? '#fde68a' : status === 'saiu_para_entrega' ? '#ede9fe' : '#d1fae5', color: status === 'pronto' ? '#92400e' : status === 'saiu_para_entrega' ? '#5b21b6' : status === 'concluido' ? '#166534' : '#0f172a' }}>
                        {grouped[status].length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {grouped[status].length === 0 ? (
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-300 text-xs italic">
                          Vazio
                        </div>
                      ) : (
                        grouped[status].map((order) => (
                          <OrderCard
                            key={order.id}
                            id={String(order.id)}
                            name={order.customerName || "Cliente"}
                            orderId={`#${String(order.id).slice(-4)}`}
                            status={order.status}
                            items={order.items}
                            total={order.total}
                            footer={order.type === 'delivery' ? 'Entrega' : 'Retirada'}
                          />
                        ))
                      )}
                    </div>
                  </DroppableColumn>
                ))}
              </div>
            </DndContext>
          )}
        </main>
  );
}
