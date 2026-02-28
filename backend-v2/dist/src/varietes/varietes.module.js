"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VarietesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const varietes_service_1 = require("./varietes.service");
const varietes_controller_1 = require("./varietes.controller");
const variete_entity_1 = require("./entities/variete.entity");
let VarietesModule = class VarietesModule {
};
exports.VarietesModule = VarietesModule;
exports.VarietesModule = VarietesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([variete_entity_1.Variete])],
        controllers: [varietes_controller_1.VarietesController],
        providers: [varietes_service_1.VarietesService],
    })
], VarietesModule);
//# sourceMappingURL=varietes.module.js.map