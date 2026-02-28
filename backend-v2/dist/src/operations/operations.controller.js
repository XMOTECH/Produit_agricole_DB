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
exports.OperationsController = void 0;
const common_1 = require("@nestjs/common");
const operations_service_1 = require("./operations.service");
const create_recolte_dto_1 = require("./dto/create-recolte.dto");
const create_vente_dto_1 = require("./dto/create-vente.dto");
const create_perte_dto_1 = require("./dto/create-perte.dto");
const swagger_1 = require("@nestjs/swagger");
let OperationsController = class OperationsController {
    constructor(operationsService) {
        this.operationsService = operationsService;
    }
    createRecolte(createRecolteDto) {
        return this.operationsService.createRecolte(createRecolteDto);
    }
    createVente(createVenteDto) {
        return this.operationsService.createVente(createVenteDto);
    }
    createPerte(createPerteDto) {
        return this.operationsService.createPerte(createPerteDto);
    }
    getHistoriqueVentes() {
        return this.operationsService.getHistoriqueVentes();
    }
    getHistoriqueRecoltes() {
        return this.operationsService.getHistoriqueRecoltes();
    }
};
exports.OperationsController = OperationsController;
__decorate([
    (0, common_1.Post)('recoltes'),
    (0, swagger_1.ApiOperation)({ summary: 'Enregistrer une nouvelle récolte' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_recolte_dto_1.CreateRecolteDto]),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "createRecolte", null);
__decorate([
    (0, common_1.Post)('ventes'),
    (0, swagger_1.ApiOperation)({ summary: 'Enregistrer une nouvelle vente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vente_dto_1.CreateVenteDto]),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "createVente", null);
__decorate([
    (0, common_1.Post)('pertes'),
    (0, swagger_1.ApiOperation)({ summary: 'Enregistrer une perte' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_perte_dto_1.CreatePerteDto]),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "createPerte", null);
__decorate([
    (0, common_1.Get)('historique/ventes'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir l\'historique des ventes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "getHistoriqueVentes", null);
__decorate([
    (0, common_1.Get)('historique/recoltes'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir l\'historique des récoltes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OperationsController.prototype, "getHistoriqueRecoltes", null);
exports.OperationsController = OperationsController = __decorate([
    (0, swagger_1.ApiTags)('operations'),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [operations_service_1.OperationsService])
], OperationsController);
//# sourceMappingURL=operations.controller.js.map