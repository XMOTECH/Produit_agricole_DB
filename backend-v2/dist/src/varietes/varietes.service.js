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
exports.VarietesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const variete_entity_1 = require("./entities/variete.entity");
let VarietesService = class VarietesService {
    constructor(varietesRepository) {
        this.varietesRepository = varietesRepository;
    }
    async create(createVarieteDto) {
        const variete = this.varietesRepository.create({
            nom_variete: createVarieteDto.nom_variete,
            description: createVarieteDto.description,
            produit: { id_produit: createVarieteDto.id_produit }
        });
        return await this.varietesRepository.save(variete);
    }
    async findAll() {
        return await this.varietesRepository.find({
            relations: ['produit'],
            order: {
                nom_variete: 'ASC',
            },
        });
    }
};
exports.VarietesService = VarietesService;
exports.VarietesService = VarietesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(variete_entity_1.Variete)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VarietesService);
//# sourceMappingURL=varietes.service.js.map