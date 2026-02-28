import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Variete } from '../varietes/entities/variete.entity';
import { Produit } from '../produits/entities/produit.entity';
import { Vente } from '../operations/entities/vente.entity';
import { Recolte } from '../operations/entities/recolte.entity';
import { Perte } from '../operations/entities/perte.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Variete, Produit, Vente, Recolte, Perte])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
