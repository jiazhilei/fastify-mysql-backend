// src/controllers/user.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service';
import { CreateUserRequest, UpdateUserRequest } from '../types/user.types';

const userService = new UserService();

export class UserController {
  async getUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await userService.findAll();
      reply.send({
        code: 200,
        message: 'Success',
        data: users
      });
    } catch (error) {
      reply.status(500).send({
        code: 500,
        message: 'Internal Server Error'
      });
    }
  }

  async getUserById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const id = parseInt(request.params.id);
      const user = await userService.findById(id);
      
      if (!user) {
        return reply.status(404).send({
          code: 404,
          message: 'User not found'
        });
      }

      reply.send({
        code: 200,
        message: 'Success',
        data: user
      });
    } catch (error) {
      reply.status(500).send({
        code: 500,
        message: 'Internal Server Error'
      });
    }
  }

  async createUser(request: FastifyRequest<{ Body: CreateUserRequest }>, reply: FastifyReply) {
    try {
      const userId = await userService.create(request.body);
      
      reply.status(201).send({
        code: 201,
        message: 'User created successfully',
        data: { id: userId }
      });
    } catch (error) {
      reply.status(500).send({
        code: 500,
        message: 'Internal Server Error'
      });
    }
  }

  async updateUser(
    request: FastifyRequest<{ 
      Params: { id: string };
      Body: UpdateUserRequest;
    }>, 
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id);
      const success = await userService.update(id, request.body);
      
      if (!success) {
        return reply.status(404).send({
          code: 404,
          message: 'User not found'
        });
      }

      reply.send({
        code: 200,
        message: 'User updated successfully'
      });
    } catch (error) {
      reply.status(500).send({
        code: 500,
        message: 'Internal Server Error'
      });
    }
  }

  async deleteUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const id = parseInt(request.params.id);
      const success = await userService.delete(id);
      
      if (!success) {
        return reply.status(404).send({
          code: 404,
          message: 'User not found'
        });
      }

      reply.send({
        code: 200,
        message: 'User deleted successfully'
      });
    } catch (error) {
      reply.status(500).send({
        code: 500,
        message: 'Internal Server Error'
      });
    }
  }
}