import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePerteDto {
  @ApiProperty({ example: 5.0, description: 'Quantité perdue en kg' })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  qte_kg: number;

  @ApiProperty({ example: 'Pourriture', description: 'Motif de la perte' })
  @IsString()
  @IsNotEmpty()
  motif: string;

  @ApiProperty({ example: 1, description: 'ID de la variété perdue' })
  @IsNumber()
  @Type(() => Number)
  id_variete: number;
}
