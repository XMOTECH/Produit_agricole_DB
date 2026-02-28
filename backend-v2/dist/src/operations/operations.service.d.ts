import { DataSource, Repository } from 'typeorm';
import { CreateRecolteDto } from './dto/create-recolte.dto';
import { CreateVenteDto } from './dto/create-vente.dto';
import { CreatePerteDto } from './dto/create-perte.dto';
import { Recolte } from './entities/recolte.entity';
import { Vente } from './entities/vente.entity';
import { Perte } from './entities/perte.entity';
export declare class OperationsService {
    private dataSource;
    private recoltesRepository;
    private ventesRepository;
    private pertesRepository;
    constructor(dataSource: DataSource, recoltesRepository: Repository<Recolte>, ventesRepository: Repository<Vente>, pertesRepository: Repository<Perte>);
    createRecolte(createRecolteDto: CreateRecolteDto): Promise<{
        success: boolean;
        message: string;
    }>;
    createVente(createVenteDto: CreateVenteDto): Promise<{
        success: boolean;
        message: string;
    }>;
    createPerte(createPerteDto: CreatePerteDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getHistoriqueVentes(): Promise<Vente[]>;
    getHistoriqueRecoltes(): Promise<Recolte[]>;
}
