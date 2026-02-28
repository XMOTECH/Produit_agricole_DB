import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Variete } from '../varietes/entities/variete.entity';
import { Produit } from '../produits/entities/produit.entity';
import { Recolte } from '../operations/entities/recolte.entity';
import csv = require('csv-parser');
import * as stream from 'stream';

@Injectable()
export class DataImportService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async importVarietesFromCsv(fileBuffer: Buffer) {
    const results: any[] = [];
    const errors: any[] = [];
    
    // Parse CSV from Buffer
    await new Promise((resolve, reject) => {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileBuffer);

      bufferStream
        .pipe(csv({
          mapHeaders: ({ header }) => header.trim().toUpperCase().replace(/ /g, '_')
        }))
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    let successCount = 0;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const row of results) {
        const nomP = row.NOM_PRODUIT || row.PRODUIT;
        const nomV = row.NOM_VARIETE || row.VARIETE;
        const desc = row.DESCRIPTION || '';
        const stockInit = parseFloat(row.STOCK_INITIAL_KG || row.STOCK || '0');
        const dateRecStr = row.DATE_RECOLTE || row.DATE;
        const qteRec = parseFloat(row.QTE_RECOLTE || row.RECOLTE || '0');

        if (!nomP || !nomV) continue;

        try {
          // 1. Gérer le Produit
          let produit = await queryRunner.manager.findOne(Produit, { where: { nom_produit: nomP.trim() } });
          if (!produit) {
            produit = queryRunner.manager.create(Produit, { nom_produit: nomP.trim() });
            await queryRunner.manager.save(produit);
          }

          // 2. Gérer la Variété
          let variete = queryRunner.manager.create(Variete, {
            nom_variete: nomV.trim(),
            description: desc.trim(),
            stock_actuel_kg: stockInit,
            produit: produit
          });
          await queryRunner.manager.save(variete);

          // 3. Gérer l'Historique de Récolte si fourni
          if (dateRecStr && dateRecStr.trim() && qteRec > 0) {
              const recolte = queryRunner.manager.create(Recolte, {
                  qte_kg: qteRec,
                  date_rec: new Date(dateRecStr.trim()), 
                  variete: variete
              });
              await queryRunner.manager.save(recolte);
              // Adding stock since it's a new harvest
              variete.stock_actuel_kg = Number(variete.stock_actuel_kg) + qteRec;
              await queryRunner.manager.save(variete);
          }

          successCount++;
        } catch (err: any) {
          errors.push({ row, error: err.message });
        }
      }

      await queryRunner.commitTransaction();
      return { 
          success: true, 
          message: `${successCount} variétés importées avec succès.`, 
          errors: errors.length > 0 ? errors : undefined 
      };
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException("Erreur de traitement CSV : " + err.message);
    } finally {
      await queryRunner.release();
    }
  }
}
