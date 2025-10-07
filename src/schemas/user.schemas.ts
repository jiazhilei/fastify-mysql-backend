import { Static, Type } from '@sinclair/typebox';

// 用户基础模式
export const UserSchema = Type.Object({
  id: Type.Number(),
  name: Type.String({ minLength: 2, maxLength: 50 }),
  email: Type.String({ format: 'email' }),
  age: Type.Optional(Type.Number({ minimum: 0, maximum: 150 })),
  created_at: Type.String({ format: 'date-time' }),
  updated_at: Type.String({ format: 'date-time' })
});

// 创建用户请求模式
export const createUserSchema = {
  body: {
    type: 'object',
    required: ['username', 'email', 'password'],
    properties: {
      username: { type: 'string', minLength: 3 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 }
    }
  }
};
// 更新用户请求模式
export const updateUserSchema = createUserSchema

// 参数验证模式
export const UserParamsSchema = Type.Object({
  id: Type.String({ pattern: '^[0-9]+$' })
});

// 响应模式
export const UserResponseSchema = Type.Object({
  success: Type.Boolean(),
  message: Type.Optional(Type.String()),
  data: Type.Union([UserSchema, Type.Array(UserSchema)]),
  total: Type.Optional(Type.Number())
});

export const ErrorResponseSchema = Type.Object({
  success: Type.Boolean(),
  message: Type.String(),
  error: Type.Optional(Type.String())
});

// 类型导出
export type User = Static<typeof UserSchema>;
// export type UpdateUserRequest = Static<typeof updateUserSchema>;
export type UserParams = Static<typeof UserParamsSchema>;

