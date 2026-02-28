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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variete = void 0;
const typeorm_1 = require("typeorm");
const produit_entity_1 = require("../../produits/entities/produit.entity");
const recolte_entity_1 = require("../../operations/entities/recolte.entity");
const vente_entity_1 = require("../../operations/entities/vente.entity");
const perte_entity_1 = require("../../operations/entities/perte.entity");
let Variete = class Variete {
};
exports.Variete = Variete;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Variete.prototype, "id_variete", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Variete.prototype, "nom_variete", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Variete.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Variete.prototype, "stock_actuel_kg", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => produit_entity_1.Produit, (produit) => produit.varietes),
    (0, typeorm_1.JoinColumn)({ name: 'id_produit' }),
    __metadata("design:type", produit_entity_1.Produit)
], Variete.prototype, "produit", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => recolte_entity_1.Recolte, (recolte) => recolte.variete),
    __metadata("design:type", Array)
], Variete.prototype, "recoltes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vente_entity_1.Vente, (vente) => vente.variete),
    __metadata("design:type", Array)
], Variete.prototype, "ventes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => perte_entity_1.Perte, (perte) => perte.variete),
    __metadata("design:type", Array)
], Variete.prototype, "pertes", void 0);
exports.Variete = Variete = __decorate([
    (0, typeorm_1.Entity)('variete')
], Variete);
//# sourceMappingURL=variete.entity.js.map