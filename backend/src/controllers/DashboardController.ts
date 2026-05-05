import { FastifyReply, FastifyRequest } from 'fastify';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getDashboard = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const metrics = await this.dashboardService.getDailyMetrics();

      return reply.status(200).send(metrics);
    } catch (error) {
      // Utilizando o logger nativo e rápido do Fastify
      request.log.error(error, 'Erro ao carregar dashboard');
      
      return reply.status(500).send({ 
        error: 'Erro interno ao buscar métricas do dashboard.' 
      });
    }
  }
}