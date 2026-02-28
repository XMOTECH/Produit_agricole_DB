import { VarietesService } from './varietes.service';
import { CreateVarieteDto } from './dto/create-variete.dto';
export declare class VarietesController {
    private readonly varietesService;
    constructor(varietesService: VarietesService);
    create(createVarieteDto: CreateVarieteDto): Promise<import("./entities/variete.entity").Variete>;
    findAll(): Promise<import("./entities/variete.entity").Variete[]>;
}
