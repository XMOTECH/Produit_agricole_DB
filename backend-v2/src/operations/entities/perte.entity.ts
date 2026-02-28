import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Variete } from '../../varietes/entities/variete.entity';

@Entity('perte')
export class Perte {
  @PrimaryGeneratedColumn()
  id_perte: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  qte_kg: number;

  @Column({ type: 'varchar', length: 255 })
  motif: string;

  @CreateDateColumn()
  date_perte: Date;

  @ManyToOne(() => Variete, (variete) => variete.pertes)
  @JoinColumn({ name: 'id_variete' })
  variete: Variete;
}
