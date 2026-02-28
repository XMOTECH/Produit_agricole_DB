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
      TOTAL_RECOLTE: tRec,
      TOTAL_VENTE_FCFA: Number(totalVenteFcfa || 0),
      TOTAL_PERTE_KG: Number(totalPerteKg || 0),
      TAUX_ECOULEMENT: Number(tauxEcoulement.toFixed(2)),
      VALEUR_STOCK_ESTIMEE: Number(valeurStockEstimee || 0)
    };
  }

  async getEvolution(period?: string) {
    const query = this.venteRepo.createQueryBuilder('v')
      .select("TO_CHAR(v.date_vente, 'YYYY-MM-DD')", 'JOUR') // Frontend expects JOUR
      .addSelect('SUM(v.qte_kg * v.prix_unitaire)', 'CA_JOUR')
      .groupBy("TO_CHAR(v.date_vente, 'YYYY-MM-DD')")
      .orderBy('"JOUR"', 'ASC');

    this.applyPeriodFilter(query, period, 'v.date_vente');
    return await query.getRawMany();
  }

  async getRepartitionProduit(period?: string) {
    const query = this.venteRepo.createQueryBuilder('v')
      .innerJoin('v.variete', 'var')
      .innerJoin('var.produit', 'p')
      .select('p.nom_produit', 'NOM_PRODUIT')
      .addSelect('SUM(v.qte_kg * v.prix_unitaire)', 'VALUE')
      .groupBy('p.nom_produit');

    this.applyPeriodFilter(query, period, 'v.date_vente');
    return await query.getRawMany();
  }

  async getTopVarietes(period?: string) {
    const query = this.varieteRepo.createQueryBuilder('v')
      .leftJoin('v.ventes', 's')
      .select('v.nom_variete', 'NOM_VARIETE')
      .addSelect('COALESCE(SUM(s.qte_kg * s.prix_unitaire), 0)', 'TOTAL_CA')
      .groupBy('v.nom_variete')
      .orderBy('"TOTAL_CA"', 'DESC')
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
      .select('v.nom_variete', 'NOM_VARIETE')
      .addSelect('COALESCE(SUM(p.qte_kg), 0)', 'TOTAL_PERTE')
      .groupBy('v.nom_variete')
      .orderBy('"TOTAL_PERTE"', 'DESC')
      .limit(5);

    if (period) {
        const days = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;
        query.andWhere('p.date_perte >= CURRENT_DATE - INTERVAL :days', { days: `${days} days` });
    }

    return await query.getRawMany();
  }

  async getRendement(period?: string, search?: string) {
    const days = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;

    const query = this.varieteRepo.createQueryBuilder('v')
      .innerJoin('v.produit', 'p')
      .select('v.id_variete', 'ID_VARIETE')
      .addSelect('v.nom_variete', 'NOM_VARIETE')
      .addSelect('p.nom_produit', 'NOM_PRODUIT')
      .addSelect('v.stock_actuel_kg', 'STOCK_ACTUEL_KG')
      .addSelect('(SELECT COALESCE(SUM(qte_kg), 0) FROM recolte WHERE id_variete = v.id_variete ' + (period ? `AND date_rec >= CURRENT_DATE - INTERVAL '${days} days'` : '') + ')', 'QTE_RECOLTEE')
      .addSelect('(SELECT COALESCE(SUM(qte_kg), 0) FROM vente WHERE id_variete = v.id_variete ' + (period ? `AND date_vente >= CURRENT_DATE - INTERVAL '${days} days'` : '') + ')', 'QTE_VENDUE')
      .addSelect('(SELECT COALESCE(SUM(qte_kg), 0) FROM perte WHERE id_variete = v.id_variete ' + (period ? `AND date_perte >= CURRENT_DATE - INTERVAL '${days} days'` : '') + ')', 'QTE_PERDUE')
      .addSelect('(SELECT COALESCE(SUM(qte_kg * prix_unitaire), 0) FROM vente WHERE id_variete = v.id_variete ' + (period ? `AND date_vente >= CURRENT_DATE - INTERVAL '${days} days'` : '') + ')', 'CA_TOTAL')
      .orderBy('"CA_TOTAL"', 'DESC');

    if (search) {
      query.where('UPPER(v.nom_variete) LIKE UPPER(:search) OR UPPER(p.nom_produit) LIKE UPPER(:search)', { search: `%${search}%` });
    }

    return await query.getRawMany();
  }

  async getActivite(period?: string) {
    const days = period === 'quarter' ? 90 : period === 'year' ? 365 : 30;
    
    // Chart expects daily aggregation: JOUR, QTE_RECOLTE, QTE_VENTE, QTE_PERTE, REVENU
    const sql = `
      WITH RECOLTE_JOUR AS (
        SELECT TO_CHAR(date_rec, 'YYYY-MM-DD') as jour, SUM(qte_kg) as qte_rec
        FROM recolte
        ${period ? "WHERE date_rec >= CURRENT_DATE - INTERVAL '1 day' * $1" : ''}
        GROUP BY 1
      ),
      VENTE_JOUR AS (
        SELECT TO_CHAR(date_vente, 'YYYY-MM-DD') as jour, SUM(qte_kg) as qte_vente, SUM(qte_kg * prix_unitaire) as revenu
        FROM vente
        ${period ? "WHERE date_vente >= CURRENT_DATE - INTERVAL '1 day' * $1" : ''}
        GROUP BY 1
      ),
      PERTE_JOUR AS (
        SELECT TO_CHAR(date_perte, 'YYYY-MM-DD') as jour, SUM(qte_kg) as qte_perte
        FROM perte
        ${period ? "WHERE date_perte >= CURRENT_DATE - INTERVAL '1 day' * $1" : ''}
        GROUP BY 1
      ),
      TOUS_JOURS AS (
        SELECT jour FROM RECOLTE_JOUR UNION SELECT jour FROM VENTE_JOUR UNION SELECT jour FROM PERTE_JOUR
      )
      SELECT 
        TJ.jour as "JOUR",
        COALESCE(RJ.qte_rec, 0) as "QTE_RECOLTE",
        COALESCE(VJ.qte_vente, 0) as "QTE_VENTE",
        COALESCE(PJ.qte_perte, 0) as "QTE_PERTE",
        COALESCE(VJ.revenu, 0) as "REVENU"
      FROM TOUS_JOURS TJ
      LEFT JOIN RECOLTE_JOUR RJ ON TJ.jour = RJ.jour
      LEFT JOIN VENTE_JOUR VJ ON TJ.jour = VJ.jour
      LEFT JOIN PERTE_JOUR PJ ON TJ.jour = PJ.jour
      ORDER BY TJ.jour DESC
      LIMIT 15
    `;
    
    // We only use $1 if it appears in the query. In the string above, it appears 3 times or 0 times.
    const params = period ? [days] : [];
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
    // Current Chart in PredictionScatterChart.jsx expects:
    // JOURS_RESTANTS, VENTE_MOYENNE_JOUR, STOCK_ACTUEL_KG, NOM_VARIETE, NIVEAU_URGENCE
    
    // Let's calculate real data: 
    // Jours Restants = Stock Actuel / Vitesse de vente (moyenne par jour sur les 30 derniers jours)
    
    const sql = `
      SELECT 
        v.nom_variete as "NOM_VARIETE",
        v.stock_actuel_kg as "STOCK_ACTUEL_KG",
        COALESCE(
          (SELECT SUM(qte_kg) FROM vente WHERE id_variete = v.id_variete AND date_vente >= CURRENT_DATE - INTERVAL '30 days') / 30.0, 
          0.1
        ) as "VENTE_MOYENNE_JOUR",
        CASE 
          WHEN (SELECT SUM(qte_kg) FROM vente WHERE id_variete = v.id_variete AND date_vente >= CURRENT_DATE - INTERVAL '30 days') > 0
          THEN ROUND(v.stock_actuel_kg / ((SELECT SUM(qte_kg) FROM vente WHERE id_variete = v.id_variete AND date_vente >= CURRENT_DATE - INTERVAL '30 days') / 30.0), 1)
          ELSE 99
        END as "JOURS_RESTANTS"
      FROM variete v
      ORDER BY "JOURS_RESTANTS" ASC
      LIMIT 10
    `;
    const rows = await this.dataSource.query(sql);
    
    return rows.map(r => ({
      ...r,
      NIVEAU_URGENCE: r.JOURS_RESTANTS < 3 ? 'CRITIQUE' : r.JOURS_RESTANTS < 7 ? 'ATTENTION' : 'SÉCURISÉ'
    }));
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
}
