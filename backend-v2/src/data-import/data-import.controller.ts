import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DataImportService } from './data-import.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('import')
@Controller('api/import')
export class DataImportController {
  constructor(private readonly dataImportService: DataImportService) {}

  @Post('varietes')
  @ApiOperation({ summary: 'Importer des variétés depuis un fichier CSV' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file')) // memory storage by default
  async uploadFile(@UploadedFile() file: any) { // Type as any for now to bypass strictly typed multer requirements in NestJS 11 if types differ
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }
    return this.dataImportService.importVarietesFromCsv(file.buffer);
  }
}
