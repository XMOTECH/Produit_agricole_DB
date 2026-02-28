import { Test, TestingModule } from '@nestjs/testing';
import { VarietesController } from './varietes.controller';

describe('VarietesController', () => {
  let controller: VarietesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VarietesController],
    }).compile();

    controller = module.get<VarietesController>(VarietesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
