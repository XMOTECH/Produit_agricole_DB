import { ProduitsService } from './produits.service';
import { CreateProduitDto } from './dto/create-produit.dto';
export declare class ProduitsController {
    private readonly produitsService;
    constructor(produitsService: ProduitsService);
    create(createProduitDto: CreateProduitDto): Promise<import("./entities/produit.entity").Produit>;
    findAll(): Promise<import("./entities/produit.entity").Produit[]>;
}
