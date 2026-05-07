import { DndContext, type DragEndEvent, closestCorners } from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { usePedidos } from '../hooks/usePedidos';
import { useUpdateOrderStatus } from '../hooks/useUpdateOrderStatus';
import { COLUMN_ORDER, COLUMN_LABELS, type OrderStatus } from '../types';

export function KanbanBoard() {
  const { pedidos, isLoading } = usePedidos();
  
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Se soltou fora de uma coluna válida, ignora
    if (!over) return;

    const orderId = String(active.id);
    const newStatus = String(over.id) as OrderStatus;

    // Acha o pedido atual para não fazer requisição se ele não mudou de coluna
    const pedidoAtual = pedidos?.find((p) => String(p.id) === orderId);
    
    if (pedidoAtual && pedidoAtual.status !== newStatus) {
      // Dispara a atualização para o backend e atualiza a tela automaticamente
      updateStatus({ orderId, newStatus });
    }
  };

  if (isLoading) {
    return <p style={{ padding: '20px' }}>Carregando painel de pedidos...</p>;
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: '20px', padding: '20px', overflowX: 'auto', minHeight: '70vh' }}>
        
        {COLUMN_ORDER.map((status) => {
          const pedidosDestaColuna = pedidos?.filter((p) => p.status === status) || [];

          return (
            <KanbanColumn 
              key={status} 
              id={status} 
              title={COLUMN_LABELS[status]} 
              pedidos={pedidosDestaColuna} 
            />
          );
        })}

      </div>
    </DndContext>
  );
}