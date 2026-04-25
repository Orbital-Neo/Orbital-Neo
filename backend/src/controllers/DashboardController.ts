import { FastifyReply, FastifyRequest } from 'fastify';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
  async getDashboard(request: FastifyRequest, reply: FastifyReply) {
    try {
      const dashboardService = new DashboardService();
      const metrics = await dashboardService.getDailyMetrics();
      
      return reply.status(200).send(metrics);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      return reply.status(500).send({ error: 'Erro interno ao buscar métricas do dashboard.' });
    }
  }
}