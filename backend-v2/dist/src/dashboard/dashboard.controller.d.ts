import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
    getAlertes(): Promise<import("../varietes/entities/variete.entity").Variete[]>;
    getPredictions(): Promise<{
        label: string;
        value: string;
        date: string;
    }[]>;
    getTrends(): Promise<any[]>;
}
