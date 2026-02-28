import { Repository } from 'typeorm';
import { CreateProduitDto } from './dto/create-produit.dto';
import { Produit } from './entities/produit.entity';
export declare class ProduitsService {
    private produitsRepository;
    constructor(produitsRepository: Repository<Produit>);
    create(createProduitDto: CreateProduitDto): Promise<Produit>;
    findAll(): Promise<Produit[]>;
}
