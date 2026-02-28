import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
    getAlertes(): Promise<import("../varietes/entities/variete.entity").Variete[]>;
    getPredictions(): Promise<any>;
    getTrends(): Promise<any[]>;
}
