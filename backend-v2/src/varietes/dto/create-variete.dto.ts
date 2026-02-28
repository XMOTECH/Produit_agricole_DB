import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVarieteDto {
  @ApiProperty({ example: 'Roma', description: 'Le nom de la variété' })
  @IsString()
  @IsNotEmpty()
  nom_variete: string;

  @ApiPropertyOptional({ example: 'Tomate allongée idéale pour les sauces', description: 'Description de la variété' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, description: 'ID du produit parent' })
  @IsNumber()
  @Type(() => Number)
  id_produit: number;
}
