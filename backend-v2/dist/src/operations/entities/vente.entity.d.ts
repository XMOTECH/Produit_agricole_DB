import { Variete } from '../../varietes/entities/variete.entity';
export declare class Vente {
    id_vente: number;
    qte_kg: number;
    prix_unitaire: number;
    date_vente: Date;
    variete: Variete;
}
