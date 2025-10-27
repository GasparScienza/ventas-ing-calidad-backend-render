import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { HistorialSesionModule } from 'src/historial-sesion/historial-sesion.module';
import { HistorialSesionService } from 'src/historial-sesion/historial-sesion.service';

@Module({
  imports: [AuthModule, HistorialSesionModule],
  controllers: [VentaController],
  providers: [VentaService, PrismaService, HistorialSesionService],
  exports: [VentaService],
})
export class VentaModule {}
