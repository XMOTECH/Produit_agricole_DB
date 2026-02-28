import { DataImportService } from './data-import.service';
export declare class DataImportController {
    private readonly dataImportService;
    constructor(dataImportService: DataImportService);
    uploadFile(file: any): Promise<{
        success: boolean;
        message: string;
        errors: any[];
    }>;
}
