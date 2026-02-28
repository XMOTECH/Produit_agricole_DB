import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVenteDto {
  @ApiProperty({ example: 20.5, description: 'Quantité vendue en kg' })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  qte_kg: number;

  @ApiProperty({ example: 500, description: 'Prix unitaire du produit en FCFA/kg' })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  prix_unitaire: number;

  @ApiProperty({ example: 1, description: 'ID de la variété vendue' })
  @IsNumber()
  @Type(() => Number)
  id_variete: number;
}
