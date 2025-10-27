import { Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { HistorialSesionService } from 'src/historial-sesion/historial-sesion.service';

@Module({
  imports: [AuthModule],
  controllers: [MarcaController],
  providers: [MarcaService, PrismaService, HistorialSesionService],
})
export class MarcaModule {}
