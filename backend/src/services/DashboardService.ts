import { db } from '../db'; 

export class DashboardService {
  async getDailyMetrics() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayOrders = await db.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
        },
        status: 'FINALIZADO', 
      },
      include: {
        items: true, 
      },
    });

    const totalVendido = todayOrders.reduce((acc: number, order) => {
      const valorDoPedido = order.items.reduce((soma, item) => {
        return soma + (Number(item.unitPrice) * item.quantity);
      }, 0);
      return acc + valorDoPedido;
    }, 0);

    let tempoTotalMs = 0;
    let pedidosValidos = 0;

    todayOrders.forEach(order => {
      if (order.updatedAt) {
        const tempoMs = order.updatedAt.getTime() - order.createdAt.getTime();
        tempoTotalMs += tempoMs;
        pedidosValidos++;
      }
    });

    const tempoMedioMs = pedidosValidos > 0 ? tempoTotalMs / pedidosValidos : 0;
    const tempoMedioMinutos = Math.round(tempoMedioMs / 60000);

    const rankingMap = new Map<string, number>();

    todayOrders.forEach(order => {
      order.items.forEach(item => {
        const currentCount = rankingMap.get(item.name) || 0; 
        rankingMap.set(item.name, currentCount + item.quantity); 
      });
    });

    const rankingSabores = Array.from(rankingMap.entries())
      .map(([sabor, quantidade]) => ({ sabor, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    return {
      totalVendido,
      tempoMedioMinutos,
      rankingSabores,
    };
  }
}