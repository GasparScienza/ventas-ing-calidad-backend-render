import { Test, TestingModule } from '@nestjs/testing';
import { HistorialSesionController } from './historial-sesion.controller';
import { HistorialSesionService } from './historial-sesion.service';

describe('HistorialSesionController', () => {
  let controller: HistorialSesionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialSesionController],
      providers: [HistorialSesionService],
    }).compile();

    controller = module.get<HistorialSesionController>(HistorialSesionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
