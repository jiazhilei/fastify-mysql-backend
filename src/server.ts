import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { initDatabase } from './config/database';
import { swaggerConfig, swaggerUiConfig } from './plugins/swagger';
import { registerRoutes } from './routes';

const fastify: FastifyInstance = Fastify({
  logger: true
})
fastify.register(swagger, swaggerConfig)
fastify.register(swaggerUi, swaggerUiConfig)

// 注册路由
registerRoutes(fastify);
// 启动服务器
const startServer = async (): Promise<void> => {
  try {
    console.log('🔄 启动服务器...');
    // 初始化数据库
    await initDatabase();
    console.log('✅ 数据库连接成功');
    const PORT = parseInt(process.env.PORT || '3000', 10);

    fastify.listen({ port: PORT, host: process.env.DB_HOST }, async (err: any, address: any) => {
      if (err) {
        fastify.log.error(err)
        process.exit(1)
      }
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

// 启动应用
startServer();