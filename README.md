## Fastify + TypeScript + MySQL 后端

一个基于 Fastify、TypeScript 和 MySQL 的最小化 REST API。包含请求校验、简单的鉴权中间件钩子、Swagger 文档以及数据库初始化。

### 功能特性
- Fastify v4 + 严格的 TypeScript 配置
- 通过 `mysql2/promise` 使用 MySQL 连接池
- 启动时自动创建 `users` 表
- 路由分层：路由 / 控制器 / 服务
- 请求体验证（TypeBox/JSON Schema）
- 在 `/docs` 提供 Swagger UI
- 开启 CORS

### 技术栈
- Fastify、@fastify/swagger、@fastify/swagger-ui、@fastify/cors
- TypeScript（strict）、ts-node、nodemon
- mysql2、dotenv

---

### 快速开始

1）安装依赖

```bash
pnpm i
# or
npm i
# or
yarn
```

2）在项目根目录创建 `.env` 文件

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=fastify_ts_db
PORT=3000
```

3）构建（生产可选）并运行

```bash
# Development (ts-node + nodemon)
pnpm dev

# Production build
pnpm build
pnpm start
```

默认情况下，服务会输出控制台日志，并在 `http://localhost:3000/docs` 暴露 Swagger UI。

> 注意：在 `src/server.ts` 中，服务绑定使用的是 `host: process.env.DB_HOST`。本地开发请确保 `DB_HOST` 为 `localhost`；如需外部访问，可改为绑定 `0.0.0.0` 或引入独立的 `HOST` 环境变量。

---

### 项目结构

```
src/
  config/
    database.ts         # MySQL 连接池 + initDatabase() 创建 users 表
  controllers/
    user.controller.ts  # UserController：CRUD 处理器
  middleware/
    auth.ts             # 简单的鉴权：仅检查 Authorization 是否存在
  plugins/
    swagger.ts          # Swagger/OpenAPI 配置与 UI 选项
  routes/
    index.ts            # 路由注册器（健康检查 + 用户）
    user.routes.ts      # /api/users 端点及校验/鉴权钩子
  schemas/
    user.schemas.ts     # 请求/响应的 JSON Schema
  services/
    user.service.ts     # 使用 mysql2 连接池的数据访问
  types/
    user.types.ts       # User 与请求 DTO 的 TypeScript 接口
  server.ts             # 应用引导（Fastify 实例、插件、路由、启动）
```

---

### 环境变量

- `DB_HOST`：MySQL 主机（当前代码也用作 Fastify 监听 host）
- `DB_USER`：MySQL 用户名
- `DB_PASSWORD`：MySQL 密码
- `DB_NAME`：MySQL 数据库名
- `PORT`：HTTP 端口（默认 `3000`）

环境变量加载由 `src/config/database.ts` 中的 `dotenv` 完成。

---

### 数据库

启动时，`initDatabase()` 会确保存在 `users` 表。

应用当前创建的 DDL：

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

但是，服务层在创建用户时期望存在 `username` 与 `password` 字段。若要与服务层类型（`src/types/user.types.ts`）以及 POST `/api/users` 所使用的 schema 保持一致，可对表结构进行如下调整：

```sql
ALTER TABLE users
  CHANGE COLUMN name username VARCHAR(255) NOT NULL,
  ADD COLUMN password VARCHAR(255) NOT NULL AFTER email,
  DROP COLUMN age;
```

也可以反向修改服务层/类型/Schema 以匹配当前 DDL。本文档默认你会将表结构对齐为包含 `username` 与 `password`。

---

### API 概览

基础地址：`http://localhost:3000`

— 健康检查
  - `GET /health` → `{ status: "OK", timestamp }`

— 用户（在路由注册器中带前缀）
  - 基础路径：`/api/users`
  - 公共接口
    - `GET /api/users/` → 获取用户列表
    - `GET /api/users/:id` → 根据 ID 获取
  - 受保护接口（需要 `Authorization` 请求头）
    - `POST /api/users/` → 创建
    - `PUT /api/users/:id` → 更新
    - `DELETE /api/users/:id` → 删除

Swagger：`GET /docs`

---

### 鉴权

`src/middleware/auth.ts` 仅检查是否存在 `Authorization` 请求头，缺失则返回 401。令牌校验逻辑留给你按需实现。

本地开发时，可发送任意非空值，例如：`Authorization: Bearer dev-token`。

---

### 请求校验

`src/schemas/user.schemas.ts` 定义了创建/更新请求的 JSON Schema。创建接口需要：

```json
{
  "username": "string (min 3)",
  "email": "email",
  "password": "string (min 6)"
}
```

当前更新接口在代码中复用了创建接口的 Schema；你可能希望将其放宽为全可选字段以支持部分更新。

---

### 请求示例

获取用户列表

```bash
curl -s http://localhost:3000/api/users/
```

根据 ID 获取用户

```bash
curl -s http://localhost:3000/api/users/1
```

创建用户（受保护）

```bash
curl -s -X POST http://localhost:3000/api/users/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-token" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "secret123"
  }'
```

更新用户（受保护）

```bash
curl -s -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dev-token" \
  -d '{
    "email": "alice+1@example.com"
  }'
```

删除用户（受保护）

```bash
curl -s -X DELETE http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer dev-token"
```

---

### 脚本

```json
{
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "build:watch": "tsc --watch"
}
```

本地开发使用 `dev`，生产环境使用 `build` + `start`。

---

### 注意与说明
- 服务监听 host 目前取自 `DB_HOST`；建议改为独立的 `HOST` 环境变量，或在容器化部署中直接使用 `0.0.0.0`。
- `users` 的 DDL 与 TypeScript 接口/Schema 存在轻微不一致，请按上文进行对齐。
- 未实现密码哈希，请勿直接用于生产。
- 未集成迁移工具；当前由运行时创建数据表。

---

### 许可证

MIT


