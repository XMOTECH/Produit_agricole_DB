import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProduitsService } from './produits.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('produits')
@Controller('api/produits')
export class ProduitsController {
  constructor(private readonly produitsService: ProduitsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau produit' })
  @ApiResponse({ status: 201, description: 'Le produit a été créé avec succès.' })
  create(@Body() createProduitDto: CreateProduitDto) {
    return this.produitsService.create(createProduitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les produits' })
  findAll() {
    return this.produitsService.findAll();
  }
}
