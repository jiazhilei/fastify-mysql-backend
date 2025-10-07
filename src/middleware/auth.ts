// src/middleware/auth.ts
import { FastifyRequest, FastifyReply } from 'fastify';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization;
  if (!token) {
    return reply.status(401).send({
      code: 401,
      message: 'Unauthorized'
    });
  }

  // 验证 token 逻辑
  // ...
}
