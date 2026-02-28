import { Produit } from '../../produits/entities/produit.entity';
import { Recolte } from '../../operations/entities/recolte.entity';
import { Vente } from '../../operations/entities/vente.entity';
import { Perte } from '../../operations/entities/perte.entity';
export declare class Variete {
    id_variete: number;
    nom_variete: string;
    description: string;
    stock_actuel_kg: number;
    produit: Produit;
    recoltes: Recolte[];
    ventes: Vente[];
    pertes: Perte[];
}
