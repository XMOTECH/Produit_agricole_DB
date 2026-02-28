import { Repository } from 'typeorm';
import { CreateVarieteDto } from './dto/create-variete.dto';
import { Variete } from './entities/variete.entity';
export declare class VarietesService {
    private varietesRepository;
    constructor(varietesRepository: Repository<Variete>);
    create(createVarieteDto: CreateVarieteDto): Promise<Variete>;
    findAll(): Promise<Variete[]>;
}
