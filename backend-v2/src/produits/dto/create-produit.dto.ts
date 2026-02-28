import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProduitDto {
  @ApiProperty({ example: 'Tomate', description: 'Le nom du produit agricole' })
  @IsString()
  @IsNotEmpty()
  nom_produit: string;
}
