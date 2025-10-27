import { Module } from '@nestjs/common';
import { HistorialSesionService } from './historial-sesion.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [],
  exports: [HistorialSesionService],
  providers: [HistorialSesionService, PrismaService]
})
export class HistorialSesionModule {}
