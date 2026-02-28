"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const produits_module_1 = require("./produits/produits.module");
const varietes_module_1 = require("./varietes/varietes.module");
const operations_module_1 = require("./operations/operations.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const data_import_module_1 = require("./data-import/data-import.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5433),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'mypassword'),
                    database: configService.get('DB_NAME', 'produit_agricole'),
                    autoLoadEntities: true,
                    synchronize: configService.get('DB_SYNCHRONIZE', false),
                    logging: configService.get('NODE_ENV') === 'development',
                    migrations: [__dirname + '/migrations/*{.ts,.js}'],
                    migrationsRun: true,
                }),
            }),
            produits_module_1.ProduitsModule,
            varietes_module_1.VarietesModule,
            operations_module_1.OperationsModule,
            dashboard_module_1.DashboardModule,
            data_import_module_1.DataImportModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map