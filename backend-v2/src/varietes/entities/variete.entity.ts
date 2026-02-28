import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Produit } from '../../produits/entities/produit.entity';
import { Recolte } from '../../operations/entities/recolte.entity';
import { Vente } from '../../operations/entities/vente.entity';
import { Perte } from '../../operations/entities/perte.entity';

@Entity('variete')
export class Variete {
  @PrimaryGeneratedColumn()
  id_variete: number;

  @Column({ type: 'varchar', length: 255 })
  nom_variete: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  stock_actuel_kg: number;

  @ManyToOne(() => Produit, (produit) => produit.varietes)
  @JoinColumn({ name: 'id_produit' })
  produit: Produit;

  @OneToMany(() => Recolte, (recolte) => recolte.variete)
  recoltes: Recolte[];

  @OneToMany(() => Vente, (vente) => vente.variete)
  ventes: Vente[];

  @OneToMany(() => Perte, (perte) => perte.variete)
  pertes: Perte[];
}
