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
exports.OperationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const recolte_entity_1 = require("./entities/recolte.entity");
const vente_entity_1 = require("./entities/vente.entity");
const perte_entity_1 = require("./entities/perte.entity");
const variete_entity_1 = require("../varietes/entities/variete.entity");
let OperationsService = class OperationsService {
    constructor(dataSource, recoltesRepository, ventesRepository, pertesRepository) {
        this.dataSource = dataSource;
        this.recoltesRepository = recoltesRepository;
        this.ventesRepository = ventesRepository;
        this.pertesRepository = pertesRepository;
    }
    async createRecolte(createRecolteDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const variete = await queryRunner.manager.findOne(variete_entity_1.Variete, { where: { id_variete: createRecolteDto.id_variete } });
            if (!variete)
                throw new common_1.BadRequestException('Variété introuvable');
            variete.stock_actuel_kg = Number(variete.stock_actuel_kg) + Number(createRecolteDto.qte_kg);
            await queryRunner.manager.save(variete);
            const recolte = queryRunner.manager.create(recolte_entity_1.Recolte, {
                qte_kg: createRecolteDto.qte_kg,
                variete: variete
            });
            await queryRunner.manager.save(recolte);
            await queryRunner.commitTransaction();
            return { success: true, message: "Récolte enregistrée." };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createVente(createVenteDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const variete = await queryRunner.manager.findOne(variete_entity_1.Variete, { where: { id_variete: createVenteDto.id_variete } });
            if (!variete)
                throw new common_1.BadRequestException('Variété introuvable');
            if (variete.stock_actuel_kg < createVenteDto.qte_kg) {
                throw new common_1.BadRequestException("STOCK INSUFFISANT : Impossible de réaliser cette vente.");
            }
            variete.stock_actuel_kg = Number(variete.stock_actuel_kg) - Number(createVenteDto.qte_kg);
            await queryRunner.manager.save(variete);
            const vente = queryRunner.manager.create(vente_entity_1.Vente, {
                qte_kg: createVenteDto.qte_kg,
                prix_unitaire: createVenteDto.prix_unitaire,
                variete: variete
            });
            await queryRunner.manager.save(vente);
            await queryRunner.commitTransaction();
            return { success: true, message: "Vente validée." };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createPerte(createPerteDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const variete = await queryRunner.manager.findOne(variete_entity_1.Variete, { where: { id_variete: createPerteDto.id_variete } });
            if (!variete)
                throw new common_1.BadRequestException('Variété introuvable');
            if (variete.stock_actuel_kg < createPerteDto.qte_kg) {
                throw new common_1.BadRequestException("ERREUR SAISIE : La perte dépasse le stock disponible.");
            }
            variete.stock_actuel_kg = Number(variete.stock_actuel_kg) - Number(createPerteDto.qte_kg);
            await queryRunner.manager.save(variete);
            const perte = queryRunner.manager.create(perte_entity_1.Perte, {
                qte_kg: createPerteDto.qte_kg,
                motif: createPerteDto.motif,
                variete: variete
            });
            await queryRunner.manager.save(perte);
            await queryRunner.commitTransaction();
            return { success: true, message: "Perte enregistrée." };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
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
};
exports.OperationsService = OperationsService;
exports.OperationsService = OperationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(1, (0, typeorm_1.InjectRepository)(recolte_entity_1.Recolte)),
    __param(2, (0, typeorm_1.InjectRepository)(vente_entity_1.Vente)),
    __param(3, (0, typeorm_1.InjectRepository)(perte_entity_1.Perte)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OperationsService);
//# sourceMappingURL=operations.service.js.map