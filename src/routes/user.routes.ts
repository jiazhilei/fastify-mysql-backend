import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { createUserSchema } from '../schemas/user.schemas';

const userController = new UserController();

export async function userRoutes(fastify: FastifyInstance) {
  // 获取所有用户
  fastify.get('/', userController.getUsers);

  // 根据ID获取用户
  fastify.get('/:id', userController.getUserById);

  // 创建用户
  fastify.post('/', {
    schema: createUserSchema,
    preHandler: authenticate,
    handler: userController.createUser,
  });

  // 更新用户
  fastify.put('/:id', {
    preHandler: authenticate,
    handler: userController.updateUser,
  });

  // 删除用户
  fastify.delete('/:id', {
    preHandler: authenticate,
    handler: userController.deleteUser,
  });
}