import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VarietesService } from './varietes.service';
import { VarietesController } from './varietes.controller';
import { Variete } from './entities/variete.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Variete])],
  controllers: [VarietesController],
  providers: [VarietesService],
})
export class VarietesModule {}
