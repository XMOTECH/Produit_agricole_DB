import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Variete } from '../../varietes/entities/variete.entity';

@Entity('produit')
export class Produit {
  @PrimaryGeneratedColumn()
  id_produit: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  nom_produit: string;

  @OneToMany(() => Variete, (variete) => variete.produit)
  varietes: Variete[];
}
