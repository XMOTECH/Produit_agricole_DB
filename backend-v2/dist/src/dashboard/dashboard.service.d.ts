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
        total_recolte: number;
        total_vente_fcfa: number;
        total_perte_kg: number;
        taux_ecoulement: number;
        valeur_stock_estimee: number;
    }>;
    getEvolution(period?: string): Promise<any[]>;
    getRepartitionProduit(period?: string): Promise<any[]>;
    getTopVarietes(period?: string): Promise<any[]>;
    getTopPertes(period?: string): Promise<any[]>;
    getRendement(period?: string, search?: string): Promise<any[]>;
    getActivite(period?: string): Promise<any>;
    getAlertesStock(): Promise<Variete[]>;
    getPredictions(): Promise<{
        label: string;
        value: string;
        date: string;
    }[]>;
    getTrends(): Promise<any[]>;
}
