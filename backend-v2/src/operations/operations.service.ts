import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateRecolteDto } from './dto/create-recolte.dto';
import { CreateVenteDto } from './dto/create-vente.dto';
import { CreatePerteDto } from './dto/create-perte.dto';
import { Recolte } from './entities/recolte.entity';
import { Vente } from './entities/vente.entity';
import { Perte } from './entities/perte.entity';
import { Variete } from '../varietes/entities/variete.entity';

@Injectable()
export class OperationsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Recolte) private recoltesRepository: Repository<Recolte>,
    @InjectRepository(Vente) private ventesRepository: Repository<Vente>,
    @InjectRepository(Perte) private pertesRepository: Repository<Perte>,
  ) {}

  async createRecolte(createRecolteDto: CreateRecolteDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const variete = await queryRunner.manager.findOne(Variete, { where: { id_variete: createRecolteDto.id_variete } });
      if (!variete) throw new BadRequestException('Variété introuvable');

      variete.stock_actuel_kg = Number(variete.stock_actuel_kg) + Number(createRecolteDto.qte_kg);
      await queryRunner.manager.save(variete);

      const recolte = queryRunner.manager.create(Recolte, {
        qte_kg: createRecolteDto.qte_kg,
        variete: variete
      });
      await queryRunner.manager.save(recolte);

      await queryRunner.commitTransaction();
      return { success: true, message: "Récolte enregistrée." };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createVente(createVenteDto: CreateVenteDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const variete = await queryRunner.manager.findOne(Variete, { where: { id_variete: createVenteDto.id_variete } });
      if (!variete) throw new BadRequestException('Variété introuvable');
      
      if (variete.stock_actuel_kg < createVenteDto.qte_kg) {
        throw new BadRequestException("STOCK INSUFFISANT : Impossible de réaliser cette vente.");
      }

      variete.stock_actuel_kg = Number(variete.stock_actuel_kg) - Number(createVenteDto.qte_kg);
      await queryRunner.manager.save(variete);

      const vente = queryRunner.manager.create(Vente, {
        qte_kg: createVenteDto.qte_kg,
        prix_unitaire: createVenteDto.prix_unitaire,
        variete: variete
      });
      await queryRunner.manager.save(vente);

      await queryRunner.commitTransaction();
      return { success: true, message: "Vente validée." };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createPerte(createPerteDto: CreatePerteDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const variete = await queryRunner.manager.findOne(Variete, { where: { id_variete: createPerteDto.id_variete } });
      if (!variete) throw new BadRequestException('Variété introuvable');

      if (variete.stock_actuel_kg < createPerteDto.qte_kg) {
        throw new BadRequestException("ERREUR SAISIE : La perte dépasse le stock disponible.");
      }

      variete.stock_actuel_kg = Number(variete.stock_actuel_kg) - Number(createPerteDto.qte_kg);
      await queryRunner.manager.save(variete);

      const perte = queryRunner.manager.create(Perte, {
        qte_kg: createPerteDto.qte_kg,
        motif: createPerteDto.motif,
        variete: variete
      });
      await queryRunner.manager.save(perte);

      await queryRunner.commitTransaction();
      return { success: true, message: "Perte enregistrée." };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getHistoriqueVentes() {
    return await this.ventesRepository.createQueryBuilder('v')
      .innerJoin('v.variete', 'var')
      .innerJoin('var.produit', 'p')
      .select('v.id_vente', 'ID_VENTE')
      .addSelect("TO_CHAR(v.date_vente, 'DD/MM/YYYY HH24:MI')", 'DATE_FMT')
      .addSelect('var.nom_variete', 'NOM_VARIETE')
      .addSelect('p.nom_produit', 'NOM_PRODUIT')
      .addSelect('v.qte_kg::numeric', 'QTE_KG')
      .addSelect('(v.qte_kg * v.prix_unitaire)::numeric', 'TOTAL_VENTE')
      .orderBy('v.date_vente', 'DESC')
      .getRawMany();
  }

  async getHistoriqueRecoltes() {
    return await this.recoltesRepository.createQueryBuilder('r')
      .innerJoin('r.variete', 'var')
      .innerJoin('var.produit', 'p')
      .select('r.id_recolte', 'ID_RECOLTE')
      .addSelect("TO_CHAR(r.date_rec, 'DD/MM/YYYY HH24:MI')", 'DATE_FMT')
      .addSelect('var.nom_variete', 'NOM_VARIETE')
      .addSelect('p.nom_produit', 'NOM_PRODUIT')
      .addSelect('r.qte_kg::numeric', 'QTE_KG')
      .orderBy('r.date_rec', 'DESC')
      .getRawMany();
  }
}
