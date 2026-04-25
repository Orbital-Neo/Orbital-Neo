import { FastifyInstance } from 'fastify';
import { DashboardController } from '../controllers/DashboardController';

export async function dashboardRoutes(app: FastifyInstance) {
  const dashboardController = new DashboardController();

  app.get('/dashboard', dashboardController.getDashboard.bind(dashboardController));
}