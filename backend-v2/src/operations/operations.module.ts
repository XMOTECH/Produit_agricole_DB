import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { Recolte } from './entities/recolte.entity';
import { Vente } from './entities/vente.entity';
import { Perte } from './entities/perte.entity';
import { Variete } from '../varietes/entities/variete.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recolte, Vente, Perte, Variete])],
  controllers: [OperationsController],
  providers: [OperationsService],
})
export class OperationsModule {}
