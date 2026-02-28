import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Variete } from '../../varietes/entities/variete.entity';

@Entity('vente')
export class Vente {
  @PrimaryGeneratedColumn()
  id_vente: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  qte_kg: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  prix_unitaire: number;

  @CreateDateColumn()
  date_vente: Date;

  @ManyToOne(() => Variete, (variete) => variete.ventes)
  @JoinColumn({ name: 'id_variete' })
  variete: Variete;
}
