"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataImportModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const data_import_service_1 = require("./data-import.service");
const data_import_controller_1 = require("./data-import.controller");
const variete_entity_1 = require("../varietes/entities/variete.entity");
const produit_entity_1 = require("../produits/entities/produit.entity");
const recolte_entity_1 = require("../operations/entities/recolte.entity");
let DataImportModule = class DataImportModule {
};
exports.DataImportModule = DataImportModule;
exports.DataImportModule = DataImportModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([variete_entity_1.Variete, produit_entity_1.Produit, recolte_entity_1.Recolte])],
        controllers: [data_import_controller_1.DataImportController],
        providers: [data_import_service_1.DataImportService],
    })
], DataImportModule);
//# sourceMappingURL=data-import.module.js.map