import { pool } from '../config/database';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/user.types';

export class UserService {
  async findAll(): Promise<User[]> {
    const [rows] = await pool.execute('SELECT * FROM users');
    return rows as User[];
  }

  async findById(id: number): Promise<User | null> {
    const [user] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return user ? user as any : null;
  }

  async create(userData: CreateUserRequest): Promise<number> {
    const { username, email, password } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    return (result as any).insertId;
  }

  async update(id: number, userData: UpdateUserRequest): Promise<boolean> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return (result as any).affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }
}