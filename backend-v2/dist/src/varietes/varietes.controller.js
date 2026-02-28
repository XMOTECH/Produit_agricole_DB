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
exports.VarietesController = void 0;
const common_1 = require("@nestjs/common");
const varietes_service_1 = require("./varietes.service");
const create_variete_dto_1 = require("./dto/create-variete.dto");
const swagger_1 = require("@nestjs/swagger");
let VarietesController = class VarietesController {
    constructor(varietesService) {
        this.varietesService = varietesService;
    }
    create(createVarieteDto) {
        return this.varietesService.create(createVarieteDto);
    }
    findAll() {
        return this.varietesService.findAll();
    }
};
exports.VarietesController = VarietesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle variété' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'La variété a été créée avec succès.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_variete_dto_1.CreateVarieteDto]),
    __metadata("design:returntype", void 0)
], VarietesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister toutes les variétés avec leurs produits' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VarietesController.prototype, "findAll", null);
exports.VarietesController = VarietesController = __decorate([
    (0, swagger_1.ApiTags)('varietes'),
    (0, common_1.Controller)('api/varietes'),
    __metadata("design:paramtypes", [varietes_service_1.VarietesService])
], VarietesController);
//# sourceMappingURL=varietes.controller.js.map