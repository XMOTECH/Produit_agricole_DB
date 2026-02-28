import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Variete } from '../../varietes/entities/variete.entity';

@Entity('recolte')
export class Recolte {
  @PrimaryGeneratedColumn()
  id_recolte: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  qte_kg: number;

  @CreateDateColumn()
  date_rec: Date;

  @ManyToOne(() => Variete, (variete) => variete.recoltes)
  @JoinColumn({ name: 'id_variete' })
  variete: Variete;
}
