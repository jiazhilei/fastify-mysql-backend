import { FastifyInstance } from 'fastify';
import { userRoutes } from './user.routes';
// import { authRoutes } from './auth.routes';

export function registerRoutes(fastify: FastifyInstance) {
  // 用户相关路由
  fastify.register(userRoutes, { prefix: '/api/users' });

  // 认证相关路由
  // fastify.register(authRoutes, { prefix: '/api/auth' });

  // 健康检查
  fastify.get('/health', async (request, reply) => {
    return { status: 'OK', timestamp: new Date().toISOString() };
  });
}