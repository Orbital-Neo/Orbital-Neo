import { useMetrics } from "../hooks/useMetrics";

export function DashboardPage() {
  const { data, isLoading, isError } = useMetrics();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg text-slate-700">
          Carregando métricas...
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="rounded-3xl bg-white border border-red-200 p-8 shadow-lg text-red-700">
          Falha ao carregar as métricas do dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-500">
          Visão geral dos pedidos de hoje e indicadores de atraso.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-3xl bg-sky-600 p-6 shadow-sm border border-sky-700 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-100/80">Pedidos hoje</p>
          <p className="mt-4 text-5xl font-bold text-white">{data.totalOrdersToday}</p>
        </article>

        <article className="rounded-3xl bg-amber-500 p-6 shadow-sm border border-amber-600 text-slate-950">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-100/90">Pedidos abertos</p>
          <p className="mt-4 text-5xl font-bold text-slate-950">{data.openOrders}</p>
        </article>

        <article className="rounded-3xl bg-rose-600 p-6 shadow-sm border border-rose-700 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-rose-100/90">Pedidos atrasados</p>
          <p className="mt-4 text-5xl font-bold text-white">{data.lateOrders}</p>
        </article>

        <article className="rounded-3xl bg-emerald-600 p-6 shadow-sm border border-emerald-700 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-100/90">Pedidos concluídos</p>
          <p className="mt-4 text-5xl font-bold text-white">{data.completedOrders}</p>
        </article>

        <article className="rounded-3xl bg-violet-700 p-6 shadow-sm border border-violet-800 col-span-full xl:col-span-2 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-violet-100/80">Tempo médio de conclusão</p>
          <p className="mt-4 text-5xl font-bold text-white">{data.avgCompletionMinutes} min</p>
          <p className="mt-2 text-sm text-violet-100/80">
            Tempo médio entre criação e finalização dos pedidos.
          </p>
        </article>
      </div>
    </div>
  );
}
