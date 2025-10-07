import mysql, { PoolOptions } from 'mysql2/promise';
import { config } from 'dotenv';

config();

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
}

const dbConfig: PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'fastify_ts_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 创建连接池
export const pool = mysql.createPool(dbConfig);

// 初始化数据库表
export const initDatabase = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    
    // 创建用户表
    const createUserTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        age INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createUserTable);
    console.log('✅ 数据库表初始化完成');
    
    connection.release();
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  }
};