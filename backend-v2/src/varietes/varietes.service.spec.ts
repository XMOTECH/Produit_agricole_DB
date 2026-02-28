import { Test, TestingModule } from '@nestjs/testing';
import { VarietesService } from './varietes.service';

describe('VarietesService', () => {
  let service: VarietesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VarietesService],
    }).compile();

    service = module.get<VarietesService>(VarietesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
