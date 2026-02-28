import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats-globales')
  @ApiOperation({ summary: 'Obtenir les statistiques globales' })
  @ApiQuery({ name: 'period', required: false, enum: ['month', 'quarter', 'year'] })
  getStatsGlobales(@Query('period') period?: string) {
    return this.dashboardService.getStatsGlobales(period);
  }

  @Get('evolution')
  @ApiOperation({ summary: 'Évolution des ventes par jour' })
  @ApiQuery({ name: 'period', required: false })
  getEvolution(@Query('period') period?: string) {
    return this.dashboardService.getEvolution(period);
  }

  @Get('repartition-produit')
  @ApiOperation({ summary: 'Répartition du CA par produit' })
  @ApiQuery({ name: 'period', required: false })
  getRepartitionProduit(@Query('period') period?: string) {
    return this.dashboardService.getRepartitionProduit(period);
  }

  @Get('top-varietes')
  @ApiOperation({ summary: 'Top 5 des variétés générant le plus de chiffre d\'affaires' })
  getTopVarietes(@Query('period') period?: string) {
    return this.dashboardService.getTopVarietes(period);
  }

  @Get('top-pertes')
  @ApiOperation({ summary: 'Top 5 des variétés avec le plus de pertes' })
  getTopPertes(@Query('period') period?: string) {
    return this.dashboardService.getTopPertes(period);
  }

  @Get('rendement')
  @ApiOperation({ summary: 'Rendement global et par variété' })
  getRendement(@Query('period') period?: string, @Query('search') search?: string) {
    return this.dashboardService.getRendement(period, search);
  }

  @Get('activite')
  @ApiOperation({ summary: 'Journal des activités récentes' })
  getActivite(@Query('period') period?: string) {
    return this.dashboardService.getActivite(period);
  }

  @Get('alertes')
  @ApiOperation({ summary: 'Alertes de stock bas' })
  getAlertes() {
    return this.dashboardService.getAlertesStock();
  }

  @Get('predictions')
  @ApiOperation({ summary: 'Prédictions analytiques' })
  getPredictions() {
    return this.dashboardService.getPredictions();
  }

  @Get('trends')
  @ApiOperation({ summary: 'Tendances du CA' })
  getTrends() {
    return this.dashboardService.getTrends();
  }
}
