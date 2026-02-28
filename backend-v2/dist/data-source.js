"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
const produit_entity_1 = require("./src/produits/entities/produit.entity");
const variete_entity_1 = require("./src/varietes/entities/variete.entity");
const recolte_entity_1 = require("./src/operations/entities/recolte.entity");
const vente_entity_1 = require("./src/operations/entities/vente.entity");
const perte_entity_1 = require("./src/operations/entities/perte.entity");
dotenv.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433'),
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'produit_agricole',
    synchronize: false,
    logging: true,
    entities: [produit_entity_1.Produit, variete_entity_1.Variete, recolte_entity_1.Recolte, vente_entity_1.Vente, perte_entity_1.Perte],
    migrations: ['./src/migrations/*.ts'],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map