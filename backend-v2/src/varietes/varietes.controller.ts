import { Controller, Get, Post, Body } from '@nestjs/common';
import { VarietesService } from './varietes.service';
import { CreateVarieteDto } from './dto/create-variete.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('varietes')
@Controller('api/varietes')
export class VarietesController {
  constructor(private readonly varietesService: VarietesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle variété' })
  @ApiResponse({ status: 201, description: 'La variété a été créée avec succès.' })
  create(@Body() createVarieteDto: CreateVarieteDto) {
    return this.varietesService.create(createVarieteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les variétés avec leurs produits' })
  findAll() {
    return this.varietesService.findAll();
  }
}
