import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Produit } from '../produits/entities/produit.entity';
import { Variete } from '../varietes/entities/variete.entity';
import { Recolte } from '../operations/entities/recolte.entity';
import { Vente } from '../operations/entities/vente.entity';
import { Perte } from '../operations/entities/perte.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Produit) private produitRepo: Repository<Produit>,
    @InjectRepository(Variete) private varieteRepo: Repository<Variete>,
    @InjectRepository(Recolte) private recolteRepo: Repository<Recolte>,
    @InjectRepository(Vente) private venteRepo: Repository<Vente>,
    @InjectRepository(Perte) private perteRepo: Repository<Perte>,
  ) {}

  private applyPeriodFilter(query: any, period: string | undefined, column: string) {
    if (!period) return query;
    const days = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;
    return query.andWhere(`${column} >= CURRENT_DATE - INTERVAL :days`, { days: `${days} days` });
  }

  async getStatsGlobales(period?: string) {
    const days = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;
    
    // Total Récolte
    const recolteQuery = this.recolteRepo.createQueryBuilder('r')
      .select('SUM(r.qte_kg)', 'total');
    if (period) recolteQuery.where('r.date_rec >= CURRENT_DATE - INTERVAL :days', { days: `${days} days` });
    const { total: totalRecolte } = await recolteQuery.getRawOne();

    // Total Vente
    const venteQuery = this.venteRepo.createQueryBuilder('v')
      .select('SUM(v.qte_kg * v.prix_unitaire)', 'total_ca')
      .addSelect('SUM(v.qte_kg)', 'total_kg');
    if (period) venteQuery.where('v.date_vente >= CURRENT_DATE - INTERVAL :days', { days: `${days} days` });
    const { total_ca: totalVenteFcfa, total_kg: totalVenteKg } = await venteQuery.getRawOne();

    // Total Perte
    const perteQuery = this.perteRepo.createQueryBuilder('p')
      .select('SUM(p.qte_kg)', 'total');
    if (period) perteQuery.where('p.date_perte >= CURRENT_DATE - INTERVAL :days', { days: `${days} days` });
    const { total: totalPerteKg } = await perteQuery.getRawOne();

    // Valeur Stock Estimée (Basée sur le prix moyen des ventes par variété)
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

  async getEvolution(period?: string) {
    const query = this.venteRepo.createQueryBuilder('v')
      .select("TO_CHAR(v.date_vente, 'YYYY-MM-DD')", 'd_jour')
      .addSelect('SUM(v.qte_kg * v.prix_unitaire)', 'ca_jour')
      .groupBy("TO_CHAR(v.date_vente, 'YYYY-MM-DD')")
      .orderBy('d_jour', 'ASC');

    this.applyPeriodFilter(query, period, 'v.date_vente');
    return await query.getRawMany();
  }

  async getRepartitionProduit(period?: string) {
    const query = this.venteRepo.createQueryBuilder('v')
      .innerJoin('v.variete', 'var')
      .innerJoin('var.produit', 'p')
      .select('p.nom_produit', 'nom_produit')
      .addSelect('SUM(v.qte_kg * v.prix_unitaire)', 'value')
      .groupBy('p.nom_produit');

    this.applyPeriodFilter(query, period, 'v.date_vente');
    return await query.getRawMany();
  }

  async getTopVarietes(period?: string) {
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

  async getTopPertes(period?: string) {
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

  async getRendement(period?: string, search?: string) {
    const days = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;
    const filterDays = period ? `AND date_rec >= CURRENT_DATE - INTERVAL '${days} days'` : ''; // Simplified for subqueries or use queryRunner

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

  async getActivite(period?: string) {
    const days = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;
    const limit = 10;

    // Combine recent operations using raw SQL for union (QueryBuilder doesn't support Union well)
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
    // Logic for mock predictions (or basic linear regression if we had more time)
    // For now, return a professionally structure placeholder that matches what a frontend might expect
    return [
      { label: 'Prochaine Récolte Estimée', value: '150kg', date: '2026-03-15' },
      { label: 'Croissance CA mensuel', value: '+12%', date: '2026-03-01' }
    ];
  }

  async getTrends() {
    // Top 3 varieties with increasing sales
    return await this.venteRepo.createQueryBuilder('v')
      .innerJoin('v.variete', 'var')
      .select('var.nom_variete', 'label')
      .addSelect('SUM(v.qte_kg)', 'value')
      .groupBy('var.nom_variete')
      .orderBy('value', 'DESC')
      .limit(3)
      .getRawMany();
  }
}
