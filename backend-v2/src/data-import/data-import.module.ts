import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataImportService } from './data-import.service';
import { DataImportController } from './data-import.controller';
import { Variete } from '../varietes/entities/variete.entity';
import { Produit } from '../produits/entities/produit.entity';
import { Recolte } from '../operations/entities/recolte.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Variete, Produit, Recolte])],
  controllers: [DataImportController],
  providers: [DataImportService],
})
export class DataImportModule {}
