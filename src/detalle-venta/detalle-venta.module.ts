import { Module } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { DetalleVentaController } from './detalle-venta.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';       // <-- Ruta al módulo de Prisma
import { ProductoModule } from '../producto/producto.module';
import { VentaModule } from '../venta/venta.module';

@Module({
  imports: [PrismaModule, ProductoModule, VentaModule],
  controllers: [DetalleVentaController],
  providers: [DetalleVentaService],
})
export class DetalleVentaModule { }
