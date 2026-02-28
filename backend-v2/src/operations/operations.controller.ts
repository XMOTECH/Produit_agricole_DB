import { Controller, Get, Post, Body } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateRecolteDto } from './dto/create-recolte.dto';
import { CreateVenteDto } from './dto/create-vente.dto';
import { CreatePerteDto } from './dto/create-perte.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('operations')
@Controller('api')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post('recoltes')
  @ApiOperation({ summary: 'Enregistrer une nouvelle récolte' })
  createRecolte(@Body() createRecolteDto: CreateRecolteDto) {
    return this.operationsService.createRecolte(createRecolteDto);
  }

  @Post('ventes')
  @ApiOperation({ summary: 'Enregistrer une nouvelle vente' })
  createVente(@Body() createVenteDto: CreateVenteDto) {
    return this.operationsService.createVente(createVenteDto);
  }

  @Post('pertes')
  @ApiOperation({ summary: 'Enregistrer une perte' })
  createPerte(@Body() createPerteDto: CreatePerteDto) {
    return this.operationsService.createPerte(createPerteDto);
  }

  @Get('historique/ventes')
  @ApiOperation({ summary: 'Obtenir l\'historique des ventes' })
  getHistoriqueVentes() {
    return this.operationsService.getHistoriqueVentes();
  }

  @Get('historique/recoltes')
  @ApiOperation({ summary: 'Obtenir l\'historique des récoltes' })
  getHistoriqueRecoltes() {
    return this.operationsService.getHistoriqueRecoltes();
  }
}
