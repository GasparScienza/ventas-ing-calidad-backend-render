import { Module } from '@nestjs/common';
import { LineaService } from './linea.service';
import { LineaController } from './linea.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { HistorialSesionService } from 'src/historial-sesion/historial-sesion.service';
import { UsuarioService } from 'src/usuario/usuario.service';
@Module({
  imports: [AuthModule],
  controllers: [LineaController],
  providers: [
    LineaService,
    PrismaService,
    HistorialSesionService,
    UsuarioService,
  ],
})
export class LineaModule {}
