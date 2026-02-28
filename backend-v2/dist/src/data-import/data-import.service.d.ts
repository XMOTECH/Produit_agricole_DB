import { DataSource } from 'typeorm';
export declare class DataImportService {
    private dataSource;
    constructor(dataSource: DataSource);
    importVarietesFromCsv(fileBuffer: Buffer): Promise<{
        success: boolean;
        message: string;
        errors: any[];
    }>;
}
