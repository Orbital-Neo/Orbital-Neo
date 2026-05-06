import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { OrderCard } from "../components/OrderCard";
import { getOrders } from "../services/api";

const STATUS_ORDER = [
  "recebido",
  "em_preparo",
  "pronto",
  "saiu_para_entrega",
  "concluido",
] as const;

const STATUS_LABELS: Record<string, string> = {
  recebido: "Recebido",
  em_preparo: "Em preparo",
  pronto: "Pronto",
  saiu_para_entrega: "Saiu para entrega",
  concluido: "Concluído",
};

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authData = localStorage.getItem("auth");
  const auth = authData ? JSON.parse(authData) : null;

  useEffect(() => {
    if (!auth || auth.user?.role !== "admin") {
      window.location.href = "/";
      return;
    }

    async function loadOrders() {
      try {
        const backendOrders = await getOrders(auth.token);
        setOrders(backendOrders);
      } catch (err) {
        const fallbackOrders = JSON.parse(
          localStorage.getItem("localOrders") || "[]"
        );
        setOrders(fallbackOrders);
        setError(
          "Não foi possível carregar os pedidos do backend. Exibindo pedidos locais."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  function handleLogout() {
    localStorage.removeItem("auth");
    window.location.href = "/";
  }

  const grouped = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = [];
    return acc;
  }, {} as Record<string, any[]>);

  orders.forEach((order) => {
    const status = order.status ?? "recebido";
    if (!grouped[status]) {
      grouped[status] = [];
    }
    grouped[status].push(order);
  });

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header onLogout={handleLogout} />

        <div className="p-6">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Pedidos</h1>
              <p className="text-slate-600 mt-2">
                Acompanhe os pedidos do cliente e veja o fluxo em tempo real.
              </p>
            </div>
            {error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-700">
              Carregando pedidos...
            </div>
          ) : (
            <div className="p-4 flex gap-4 overflow-x-auto">
              {STATUS_ORDER.map((status) => (
                <div key={status} className="flex-1 min-w-[260px]">
                  <h2 className="text-orange-500 mb-3 font-semibold">
                    {STATUS_LABELS[status]}
                  </h2>

                  <div className="space-y-4">
                    {(grouped[status] || []).length === 0 ? (
                      <div className="rounded-3xl border border-slate-200 bg-white p-4 text-slate-500">
                        Sem pedidos
                      </div>
                    ) : (
                      grouped[status].map((order) => (
                        <OrderCard
                          key={order.id}
                          name={order.customerName || "Cliente"}
                          orderId={String(order.number ?? order.id).slice(0, 8)}
                          status={order.status ?? "recebido"}
                          items={order.items ?? []}
                          footer={order.type ? `Tipo: ${order.type}` : undefined}
                          total={order.total}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
