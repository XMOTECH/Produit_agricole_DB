import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVarieteDto } from './dto/create-variete.dto';
import { Variete } from './entities/variete.entity';

@Injectable()
export class VarietesService {
  constructor(
    @InjectRepository(Variete)
    private varietesRepository: Repository<Variete>,
  ) {}

  async create(createVarieteDto: CreateVarieteDto) {
    const variete = this.varietesRepository.create({
        nom_variete: createVarieteDto.nom_variete,
        description: createVarieteDto.description,
        produit: { id_produit: createVarieteDto.id_produit }
    });
    return await this.varietesRepository.save(variete);
  }

  async findAll() {
    return await this.varietesRepository.find({
      relations: ['produit'], // Eager loading
      order: {
        nom_variete: 'ASC',
      },
    });
  }
}
