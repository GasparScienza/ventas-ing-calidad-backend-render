import { Test, TestingModule } from '@nestjs/testing';
import { HistorialSesionService } from './historial-sesion.service';

describe('HistorialSesionService', () => {
  let service: HistorialSesionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistorialSesionService],
    }).compile();

    service = module.get<HistorialSesionService>(HistorialSesionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
