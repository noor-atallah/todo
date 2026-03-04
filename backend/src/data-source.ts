import { DataSource } from 'typeorm';
import { Todo } from './todo/todo.entity';
import { User } from './user/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Todo, User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  ssl: { rejectUnauthorized: false },
});