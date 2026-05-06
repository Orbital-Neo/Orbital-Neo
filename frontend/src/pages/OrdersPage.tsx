import { Header } from "../components/Header";
import { KanbanColumn } from "../components/KanbanColumn";
import { Sidebar } from "../components/Sidebar";


export function OrdersPage() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo */}
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        {/* Kanban */}
        <div className="p-4 flex gap-4 overflow-x-auto">
          <KanbanColumn title="Recebido" />
          <KanbanColumn title="Em preparo" />
          <KanbanColumn title="Pronto" />
          <KanbanColumn title="Saiu para entrega" />
          <KanbanColumn title="Concluído" />
        </div>
      </div>
    </div>
  );
}