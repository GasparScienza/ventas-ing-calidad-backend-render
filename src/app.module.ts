import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ProductoModule } from './producto/producto.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { EstadoModule } from './estado/estado.module';
import { UsuarioModule } from './usuario/usuario.module';
import { MarcaModule } from './marca/marca.module';
import { LineaModule } from './linea/linea.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { VentaModule } from './venta/venta.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';
import { HistorialSesionModule } from './historial-sesion/historial-sesion.module';

@Module({
  imports: [
    UsuarioModule,
    MarcaModule,
    ProductoModule,
    LineaModule,
    AuthModule,
    ConfigModule.forRoot({
      // se encarga de leer automáticamente tu archivo .env (por defecto en la raíz del proyecto) y cargar sus variables en process.env
      isGlobal: true,
    }),
    ProveedorModule,
    EstadoModule,
    VentaModule,
    DetalleVentaModule,
    HistorialSesionModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
