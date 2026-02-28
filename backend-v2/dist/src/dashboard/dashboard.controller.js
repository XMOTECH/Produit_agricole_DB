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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const swagger_1 = require("@nestjs/swagger");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getStatsGlobales(period) {
        return this.dashboardService.getStatsGlobales(period);
    }
    getEvolution(period) {
        return this.dashboardService.getEvolution(period);
    }
    getRepartitionProduit(period) {
        return this.dashboardService.getRepartitionProduit(period);
    }
    getTopVarietes(period) {
        return this.dashboardService.getTopVarietes(period);
    }
    getTopPertes(period) {
        return this.dashboardService.getTopPertes(period);
    }
    getRendement(period, search) {
        return this.dashboardService.getRendement(period, search);
    }
    getActivite(period) {
        return this.dashboardService.getActivite(period);
    }
    getAlertes() {
        return this.dashboardService.getAlertesStock();
    }
    getPredictions() {
        return this.dashboardService.getPredictions();
    }
    getTrends() {
        return this.dashboardService.getTrends();
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('stats-globales'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les statistiques globales' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, enum: ['month', 'quarter', 'year'] }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getStatsGlobales", null);
__decorate([
    (0, common_1.Get)('evolution'),
    (0, swagger_1.ApiOperation)({ summary: 'Évolution des ventes par jour' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getEvolution", null);
__decorate([
    (0, common_1.Get)('repartition-produit'),
    (0, swagger_1.ApiOperation)({ summary: 'Répartition du CA par produit' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getRepartitionProduit", null);
__decorate([
    (0, common_1.Get)('top-varietes'),
    (0, swagger_1.ApiOperation)({ summary: 'Top 5 des variétés générant le plus de chiffre d\'affaires' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getTopVarietes", null);
__decorate([
    (0, common_1.Get)('top-pertes'),
    (0, swagger_1.ApiOperation)({ summary: 'Top 5 des variétés avec le plus de pertes' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getTopPertes", null);
__decorate([
    (0, common_1.Get)('rendement'),
    (0, swagger_1.ApiOperation)({ summary: 'Rendement global et par variété' }),
    __param(0, (0, common_1.Query)('period')),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getRendement", null);
__decorate([
    (0, common_1.Get)('activite'),
    (0, swagger_1.ApiOperation)({ summary: 'Journal des activités récentes' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getActivite", null);
__decorate([
    (0, common_1.Get)('alertes'),
    (0, swagger_1.ApiOperation)({ summary: 'Alertes de stock bas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getAlertes", null);
__decorate([
    (0, common_1.Get)('predictions'),
    (0, swagger_1.ApiOperation)({ summary: 'Prédictions analytiques' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getPredictions", null);
__decorate([
    (0, common_1.Get)('trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Tendances du CA' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getTrends", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('dashboard'),
    (0, common_1.Controller)('api/dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map