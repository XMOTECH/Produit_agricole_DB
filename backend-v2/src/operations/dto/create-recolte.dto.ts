import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecolteDto {
  @ApiProperty({ example: 100.5, description: 'Quantité récoltée en kg' })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  qte_kg: number;

  @ApiProperty({ example: 1, description: 'ID de la variété récoltée' })
  @IsNumber()
  @Type(() => Number)
  id_variete: number;
}
