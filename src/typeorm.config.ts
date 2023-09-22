import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User],
  ssl: true,
  migrations: ['src/migrations/*.ts'],
});
