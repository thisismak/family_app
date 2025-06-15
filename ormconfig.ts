import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || 'db.sqlite3',
  entities: ['src/entities/*.ts'],
  migrations: ['migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});