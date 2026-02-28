"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const produit_entity_1 = require("../produits/entities/produit.entity");
const variete_entity_1 = require("../varietes/entities/variete.entity");
const recolte_entity_1 = require("../operations/entities/recolte.entity");
const vente_entity_1 = require("../operations/entities/vente.entity");
const perte_entity_1 = require("../operations/entities/perte.entity");
let DashboardService = class DashboardService {
    constructor(dataSource, produitRepo, varieteRepo, recolteRepo, venteRepo, perteRepo) {
        this.dataSource = dataSource;
        this.produitRepo = produitRepo;
        this.varieteRepo = varieteRepo;
        this.recolteRepo = recolteRepo;
        this.venteRepo = venteRepo;
        this.perteRepo = perteRepo;
    }
    applyPeriodFilter(query, period, column) {
        if (!period)
            return query;
        const days = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;
        return query.andWhere(`${column} >= CURRENT_DATE - INTERVAL :days`, { days: `${days} days` });
    }
    async getStatsGlobales(period) {
        const days = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;
        const recolteQuery = this.recolteRepo.createQueryBuilder('r')
            .select('SUM(r.qte_kg)', 'total');
        if (period)
            recolteQuery.where('r.date_rec >= CURRENT_DATE - INTERVAL :days', { days: `${days} days` });
        const { total: totalRecolte } = await recolteQuery.getRawOne();
        const venteQuery = this.venteRepo.createQueryBuilder('v')
            .select('SUM(v.qte_kg * v.prix_unitaire)', 'total_ca')
            .addSelect('SUM(v.qte_kg)', 'total_kg');
        if (period)
            venteQuery.where('v.date_vente >= CURRENT_DATE - INTERVAL :days', { days: `${days} days` });
        const { total_ca: totalVenteFcfa, total_kg: totalVenteKg } = await venteQuery.getRawOne();
        const perteQuery = this.perteRepo.createQueryBuilder('p')
            .select('SUM(p.qte_kg)', 'total');
        if (period)
            perteQuery.where('p.date_perte >= CURRENT_DATE - INTERVAL :days', { days: `${days} days` });
        const { total: totalPerteKg } = await perteQuery.getRawOne();
        const stockQuery = this.varieteRepo.createQueryBuilder('v')
            .select('SUM(v.stock_actuel_kg * (SELECT COALESCE(AVG(s.prix_unitaire), 0) FROM vente s WHERE s.id_variete = v.id_variete))', 'valeur');
        const { valeur: valeurStockEstimee } = await stockQuery.getRawOne();
        const tRec = Number(totalRecolte || 0);
        const tVenteKg = Number(totalVenteKg || 0);
        const tauxEcoulement = tRec > 0 ? (tVenteKg / tRec) * 100 : 0;
        return {
            total_recolte: tRec,
            total_vente_fcfa: Number(totalVenteFcfa || 0),
            total_perte_kg: Number(totalPerteKg || 0),
            taux_ecoulement: Number(tauxEcoulement.toFixed(2)),
            valeur_stock_estimee: Number(valeurStockEstimee || 0)
        };
    }
    async getEvolution(period) {
        const query = this.venteRepo.createQueryBuilder('v')
            .select("TO_CHAR(v.date_vente, 'YYYY-MM-DD')", 'd_jour')
            .addSelect('SUM(v.qte_kg * v.prix_unitaire)', 'ca_jour')
            .groupBy("TO_CHAR(v.date_vente, 'YYYY-MM-DD')")
            .orderBy('d_jour', 'ASC');
        this.applyPeriodFilter(query, period, 'v.date_vente');
        return await query.getRawMany();
    }
    async getRepartitionProduit(period) {
        const query = this.venteRepo.createQueryBuilder('v')
            .innerJoin('v.variete', 'var')
            .innerJoin('var.produit', 'p')
            .select('p.nom_produit', 'nom_produit')
            .addSelect('SUM(v.qte_kg * v.prix_unitaire)', 'value')
            .groupBy('p.nom_produit');
        this.applyPeriodFilter(query, period, 'v.date_vente');
        return await query.getRawMany();
    }
    async getTopVarietes(period) {
        const query = this.varieteRepo.createQueryBuilder('v')
            .leftJoin('v.ventes', 's')
            .select('v.nom_variete', 'nom_variete')
            .addSelect('COALESCE(SUM(s.qte_kg * s.prix_unitaire), 0)', 'total_ca')
            .groupBy('v.nom_variete')
            .orderBy('total_ca', 'DESC')
            .limit(5);
        if (period) {
            const days = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;
            query.andWhere('s.date_vente >= CURRENT_DATE - INTERVAL :days', { days: `${days} days` });
        }
        return await query.getRawMany();
    }
    async getTopPertes(period) {
        const query = this.varieteRepo.createQueryBuilder('v')
            .leftJoin('v.pertes', 'p')
            .select('v.nom_variete', 'nom_variete')
            .addSelect('COALESCE(SUM(p.qte_kg), 0)', 'total_perte')
            .groupBy('v.nom_variete')
            .orderBy('total_perte', 'DESC')
            .limit(5);
        if (period) {
            const days = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;
            query.andWhere('p.date_perte >= CURRENT_DATE - INTERVAL :days', { days: `${days} days` });
        }
        return await query.getRawMany();
    }
    async getRendement(period, search) {
        const days = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;
        const filterDays = period ? `AND date_rec >= CURRENT_DATE - INTERVAL '${days} days'` : '';
        const query = this.varieteRepo.createQueryBuilder('v')
            .innerJoin('v.produit', 'p')
            .select('v.id_variete', 'id_variete')
            .addSelect('v.nom_variete', 'nom_variete')
            .addSelect('p.nom_produit', 'nom_produit')
            .addSelect('v.stock_actuel_kg', 'stock_actuel_kg')
            .addSelect('(SELECT COALESCE(SUM(qte_kg), 0) FROM recolte WHERE id_variete = v.id_variete ' + (period ? `AND date_rec >= CURRENT_DATE - INTERVAL '${days} days'` : '') + ')', 'qte_recoltee')
            .addSelect('(SELECT COALESCE(SUM(qte_kg), 0) FROM vente WHERE id_variete = v.id_variete ' + (period ? `AND date_vente >= CURRENT_DATE - INTERVAL '${days} days'` : '') + ')', 'qte_vendue')
            .addSelect('(SELECT COALESCE(SUM(qte_kg), 0) FROM perte WHERE id_variete = v.id_variete ' + (period ? `AND date_perte >= CURRENT_DATE - INTERVAL '${days} days'` : '') + ')', 'qte_perdue')
            .addSelect('(SELECT COALESCE(SUM(qte_kg * prix_unitaire), 0) FROM vente WHERE id_variete = v.id_variete ' + (period ? `AND date_vente >= CURRENT_DATE - INTERVAL '${days} days'` : '') + ')', 'ca_total')
            .orderBy('ca_total', 'DESC');
        if (search) {
            query.where('UPPER(v.nom_variete) LIKE UPPER(:search) OR UPPER(p.nom_produit) LIKE UPPER(:search)', { search: `%${search}%` });
        }
        return await query.getRawMany();
    }
    async getActivite(period) {
        const days = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;
        const limit = 10;
        const sql = `
      (SELECT 'recolte' as type, date_rec as date, qte_kg, NULL as prix_unitaire, v.nom_variete 
       FROM recolte r JOIN variete v ON r.id_variete = v.id_variete
       ${period ? "WHERE date_rec >= CURRENT_DATE - INTERVAL '1 day' * $1" : ''})
      UNION ALL
      (SELECT 'vente' as type, date_vente as date, qte_kg, prix_unitaire, v.nom_variete 
       FROM vente s JOIN variete v ON s.id_variete = v.id_variete
       ${period ? "WHERE date_vente >= CURRENT_DATE - INTERVAL '1 day' * $1" : ''})
      UNION ALL
      (SELECT 'perte' as type, date_perte as date, qte_kg, NULL as prix_unitaire, v.nom_variete 
       FROM perte p JOIN variete v ON p.id_variete = v.id_variete
       ${period ? "WHERE date_perte >= CURRENT_DATE - INTERVAL '1 day' * $1" : ''})
      ORDER BY date DESC
      LIMIT $2
    `;
        const params = period ? [days, limit] : [99999, limit];
        return await this.dataSource.query(sql, params);
    }
    async getAlertesStock() {
        return await this.varieteRepo.createQueryBuilder('v')
            .innerJoinAndSelect('v.produit', 'p')
            .where('v.stock_actuel_kg < :threshold', { threshold: 10 })
            .orderBy('v.stock_actuel_kg', 'ASC')
            .getMany();
    }
    async getPredictions() {
        return [
            { label: 'Prochaine Récolte Estimée', value: '150kg', date: '2026-03-15' },
            { label: 'Croissance CA mensuel', value: '+12%', date: '2026-03-01' }
        ];
    }
    async getTrends() {
        return await this.venteRepo.createQueryBuilder('v')
            .innerJoin('v.variete', 'var')
            .select('var.nom_variete', 'label')
            .addSelect('SUM(v.qte_kg)', 'value')
            .groupBy('var.nom_variete')
            .orderBy('value', 'DESC')
            .limit(3)
            .getRawMany();
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, typeorm_1.InjectRepository)(produit_entity_1.Produit)),
    __param(2, (0, typeorm_1.InjectRepository)(variete_entity_1.Variete)),
    __param(3, (0, typeorm_1.InjectRepository)(recolte_entity_1.Recolte)),
    __param(4, (0, typeorm_1.InjectRepository)(vente_entity_1.Vente)),
    __param(5, (0, typeorm_1.InjectRepository)(perte_entity_1.Perte)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map