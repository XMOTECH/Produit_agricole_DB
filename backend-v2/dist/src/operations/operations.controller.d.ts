import { OperationsService } from './operations.service';
import { CreateRecolteDto } from './dto/create-recolte.dto';
import { CreateVenteDto } from './dto/create-vente.dto';
import { CreatePerteDto } from './dto/create-perte.dto';
export declare class OperationsController {
    private readonly operationsService;
    constructor(operationsService: OperationsService);
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
    getHistoriqueVentes(): Promise<import("./entities/vente.entity").Vente[]>;
    getHistoriqueRecoltes(): Promise<import("./entities/recolte.entity").Recolte[]>;
}
