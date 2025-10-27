import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistorialSesionService } from 'src/historial-sesion/historial-sesion.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProductoController],
  providers: [
    ProductoService,
    PrismaService,
    HistorialSesionService,
    UsuarioService,
  ],
  exports: [ProductoService],
})
export class ProductoModule {}
