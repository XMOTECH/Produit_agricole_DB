import { DataSource, Repository } from 'typeorm';
import { Produit } from '../produits/entities/produit.entity';
import { Variete } from '../varietes/entities/variete.entity';
import { Recolte } from '../operations/entities/recolte.entity';
import { Vente } from '../operations/entities/vente.entity';
import { Perte } from '../operations/entities/perte.entity';
export declare class DashboardService {
    private dataSource;
    private produitRepo;
    private varieteRepo;
    private recolteRepo;
    private venteRepo;
    private perteRepo;
    constructor(dataSource: DataSource, produitRepo: Repository<Produit>, varieteRepo: Repository<Variete>, recolteRepo: Repository<Recolte>, venteRepo: Repository<Vente>, perteRepo: Repository<Perte>);
    private applyPeriodFilter;
    getStatsGlobales(period?: string): Promise<{
        TOTAL_RECOLTE: number;
        TOTAL_VENTE_FCFA: number;
        TOTAL_PERTE_KG: number;
        TAUX_ECOULEMENT: number;
        VALEUR_STOCK_ESTIMEE: number;
    }>;
    getEvolution(period?: string): Promise<any[]>;
    getRepartitionProduit(period?: string): Promise<any[]>;
    getTopVarietes(period?: string): Promise<any[]>;
    getTopPertes(period?: string): Promise<any[]>;
    getRendement(period?: string, search?: string): Promise<any[]>;
    getActivite(period?: string): Promise<any>;
    getAlertesStock(): Promise<Variete[]>;
    getPredictions(): Promise<any>;
    getTrends(): Promise<any[]>;
}
