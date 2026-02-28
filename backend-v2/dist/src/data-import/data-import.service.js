"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataImportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const variete_entity_1 = require("../varietes/entities/variete.entity");
const produit_entity_1 = require("../produits/entities/produit.entity");
const recolte_entity_1 = require("../operations/entities/recolte.entity");
const csv = require("csv-parser");
const stream = require("stream");
let DataImportService = class DataImportService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async importVarietesFromCsv(fileBuffer) {
        const results = [];
        const errors = [];
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
                if (!nomP || !nomV)
                    continue;
                try {
                    let produit = await queryRunner.manager.findOne(produit_entity_1.Produit, { where: { nom_produit: nomP.trim() } });
                    if (!produit) {
                        produit = queryRunner.manager.create(produit_entity_1.Produit, { nom_produit: nomP.trim() });
                        await queryRunner.manager.save(produit);
                    }
                    let variete = queryRunner.manager.create(variete_entity_1.Variete, {
                        nom_variete: nomV.trim(),
                        description: desc.trim(),
                        stock_actuel_kg: stockInit,
                        produit: produit
                    });
                    await queryRunner.manager.save(variete);
                    if (dateRecStr && dateRecStr.trim() && qteRec > 0) {
                        const recolte = queryRunner.manager.create(recolte_entity_1.Recolte, {
                            qte_kg: qteRec,
                            date_rec: new Date(dateRecStr.trim()),
                            variete: variete
                        });
                        await queryRunner.manager.save(recolte);
                        variete.stock_actuel_kg = Number(variete.stock_actuel_kg) + qteRec;
                        await queryRunner.manager.save(variete);
                    }
                    successCount++;
                }
                catch (err) {
                    errors.push({ row, error: err.message });
                }
            }
            await queryRunner.commitTransaction();
            return {
                success: true,
                message: `${successCount} variétés importées avec succès.`,
                errors: errors.length > 0 ? errors : undefined
            };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw new common_1.BadRequestException("Erreur de traitement CSV : " + err.message);
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.DataImportService = DataImportService;
exports.DataImportService = DataImportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], DataImportService);
//# sourceMappingURL=data-import.service.js.map