import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProduitDto } from './dto/create-produit.dto';
import { Produit } from './entities/produit.entity';

@Injectable()
export class ProduitsService {
  constructor(
    @InjectRepository(Produit)
    private produitsRepository: Repository<Produit>,
  ) {}

  async create(createProduitDto: CreateProduitDto) {
    const produit = this.produitsRepository.create(createProduitDto);
    return await this.produitsRepository.save(produit);
  }

  async findAll() {
    return await this.produitsRepository.find({
      order: {
        nom_produit: 'ASC',
      },
    });
  }
}
