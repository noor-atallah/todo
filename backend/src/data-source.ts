import { DataSource } from 'typeorm';
import { Todo } from './todo/todo.entity';
import { User } from './user/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'tododb',
  entities: [Todo, User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});