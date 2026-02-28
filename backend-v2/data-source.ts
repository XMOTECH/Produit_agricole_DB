import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Produit } from './src/produits/entities/produit.entity';
import { Variete } from './src/varietes/entities/variete.entity';
import { Recolte } from './src/operations/entities/recolte.entity';
import { Vente } from './src/operations/entities/vente.entity';
import { Perte } from './src/operations/entities/perte.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'produit_agricole',
  synchronize: false, // Always false for migrations
  logging: true,
  entities: [Produit, Variete, Recolte, Vente, Perte],
  migrations: ['./src/migrations/*.ts'],
  subscribers: [],
});
