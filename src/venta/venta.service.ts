import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { AuthService } from '../auth/auth.service';
import { HistorialSesionService } from 'src/historial-sesion/historial-sesion.service';
import { Request } from 'express';
import { Payload } from 'src/auth/entities/payload.entity';
@Injectable()
export class VentaService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private historialService: HistorialSesionService,
  ) {}
  //INTENTO DE Crear venta con detalles de venta-------------------------
  async create(createVentaDto: CreateVentaDto, req: Request) {
    const { usuarioId, detalles } = createVentaDto;

    // Usaremos una transacción por si la creación de detalles falla
    return this.prisma.$transaction(async (tx) => {
      let totalCalculado = new Decimal(0);
      const detallesData: {
        productoId: number;
        cantidad: number;
        subTotal: Decimal;
      }[] = [];
      const productoIds = detalles.map((d) => d.productoId);

      // 1. Obtener los precios de todos los productos en una sola consulta
      const productos = await tx.producto.findMany({
        where: { id: { in: productoIds } },
        select: { id: true, precio: true },
      });

      if (productos.length !== productoIds.length) {
        throw new HttpException(
          'Uno o más productos no existen en el catálogo.',
          HttpStatus.NOT_FOUND,
        );
      }

      const productoMap = new Map(
        productos.map((p) => [p.id, p.precio as unknown as Decimal]),
      ); //ni idea porque me pide el as unknown

      // 2. Calcular el Total y preparar los Detalles
      for (const item of detalles) {
        const precioDecimal = productoMap.get(item.productoId);

        // Si el producto no se encontró (aunque ya validamos arriba, es buena práctica)
        if (!precioDecimal) {
          throw new HttpException(
            `Producto con ID ${item.productoId} no encontrado.`,
            HttpStatus.NOT_FOUND,
          );
        }

        // Cálculo
        const subTotal = precioDecimal.mul(item.cantidad);
        totalCalculado = totalCalculado.add(subTotal);

        detallesData.push({
          productoId: item.productoId,
          cantidad: item.cantidad,
          subTotal: subTotal,
        });
      }

      // 3. Crear el encabezado de la Venta
      const nuevaVenta = await tx.venta.create({
        data: {
          usuarioId: usuarioId,
          total: totalCalculado.toNumber(),
          fechaHora: new Date(),
        },
      });

      // 4. Crear los Detalles de Venta (conexión de Clave Foránea)
      const detallesFinales = detallesData.map((d) => ({
        productoId: d.productoId,
        cantidad: d.cantidad,
        subTotal: d.subTotal.toNumber(),
        ventaId: nuevaVenta.id,
      }));

      await tx.detalleVenta.createMany({
        data: detallesFinales as any,
      });
      const user: Payload = this.authService.getProfile(req);
      await this.historialService.create({
        usuarioId: user.id,
        fechaHora: new Date(),
        accion: 'Crear venta',
      });

      // La transacción termina aquí, todo fue creado. Muestra mensaje de éxito y total calculado
      return `Venta creada correctamente. Total: ${totalCalculado.toNumber()}`;
    });
  }
  //---------------------------------------------------------
  async findAll() {
    const ventas = await this.prisma.venta.findMany({
      select: {
        id: true,
        fechaHora: true,
        total: true,
        usuario: { select: { id: true, nombre: true } },
      },
    });
    if (ventas.length === 0) {
      return { message: 'No hay ventas registradas' };
    }
    return ventas;
  }
  async findOne(id: number) {
    const venta = await this.prisma.venta.findUnique({
      where: { id },
      select: {
        id: true,
        fechaHora: true,
        total: true,
        usuario: { select: { id: true, nombre: true } },
      },
    });
    if (!venta) {
      throw new HttpException('La venta no existe', HttpStatus.NOT_FOUND);
    }
    return venta;
  }
  async update(id: number, updateVentaDto: UpdateVentaDto) {
    await this.findOne(id);
    await this.prisma.venta.update({
      where: { id },
      data: updateVentaDto,
    });
    return 'Venta actualizada correctamente';
  }

  async remove(id: number, req: Request) {
    await this.findOne(id);
    await this.prisma.venta.delete({
      where: { id },
    });
    const user: Payload = this.authService.getProfile(req);
    await this.historialService.create({
      usuarioId: user.id,
      fechaHora: new Date(),
      accion: 'Eliminar venta',
    });
    return 'Venta eliminada correctamente';
  }
}
