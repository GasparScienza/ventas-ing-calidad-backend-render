import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductoService } from 'src/producto/producto.service';
import { VentaService } from 'src/venta/venta.service';
import { DateTime } from 'luxon';
import { Decimal } from '@prisma/client/runtime/binary';


@Injectable()
export class DetalleVentaService {
  constructor(private prisma: PrismaService, private producto: ProductoService, private venta: VentaService) { }
  async create(createDetalleVentaDto: CreateDetalleVentaDto) {
    const producto = await this.producto.findOne(createDetalleVentaDto.productoId);
    if (!producto) {
      throw new HttpException('El producto no existe', HttpStatus.NOT_FOUND);
    }
    // calcular subtotal y asignarlo al detalle de venta
    const precioDecimal = new Decimal(producto.precio as unknown as string);
    const subTotalDecimal = precioDecimal.mul(createDetalleVentaDto.cantidad);
    createDetalleVentaDto.subtotal = subTotalDecimal.toNumber();
    try {
      await this.prisma.detalleVenta.create({
        data: createDetalleVentaDto,
      });
      // Muestra mensaje de éxito y el subtotal calculado. Ademas de actualizar la venta
      const venta = await this.venta.findOne(createDetalleVentaDto.ventaId);
      venta.total += createDetalleVentaDto.subtotal;
      await this.prisma.venta.update({
        where: { id: createDetalleVentaDto.ventaId },
        data: { total: venta.total, fechaHora: DateTime.now().toJSDate() },
      });
      return `Detalle de venta creado correctamente. Subtotal: ${createDetalleVentaDto.subtotal}. Venta actualizada. Total: ${venta.total}`;
    } catch (error) {
      throw new HttpException('Error al crear el detalle de venta', HttpStatus.NOT_FOUND, { cause: error });
    }
  }

  async findAll() {
    const detallesVenta = await this.prisma.detalleVenta.findMany({
      select: {
        id: true,
        cantidad: true,
        subtotal: true,
        producto: { select: { id: true, nombre: true } },
        venta: { select: { id: true, fechaHora: true } },
      },
    });
    if (detallesVenta.length === 0) {
      return { message: 'No hay detalles de venta registrados' };
    }
    return detallesVenta;
  }
  async findOne(id: number) {
    const detalleVenta = await this.prisma.detalleVenta.findUnique({
      where: { id },
      select: {
        id: true,
        cantidad: true,
        subtotal: true,
        producto: { select: { id: true, nombre: true } },
        venta: { select: { id: true, fechaHora: true } },
      },
    });
    if (!detalleVenta) {
      return new HttpException('El detalle de venta no existe', HttpStatus.NOT_FOUND);
    }
    return detalleVenta;
  }
  async update(id: number, updateDetalleVentaDto: UpdateDetalleVentaDto) {
    //Actualizar detalle de venta seleccionado cambiando solo cantidad y subtotal. Prohibiendo poner cantidad cero o negativa
    if (updateDetalleVentaDto.cantidad !== undefined && updateDetalleVentaDto.cantidad <= 0) {
      throw new HttpException('La cantidad debe ser mayor a cero', HttpStatus.BAD_REQUEST);
    }
    await this.findOne(id);
    const detalleVenta = await this.prisma.detalleVenta.findUnique({
      where: { id },
    });
    if (!detalleVenta) {
      throw new HttpException('El detalle de venta no existe', HttpStatus.NOT_FOUND);
    }
    const subtotalAnterior = detalleVenta.subtotal;
    await this.prisma.detalleVenta.update({
      where: { id },
      data: updateDetalleVentaDto,
    });
    return 'Detalle de venta actualizado correctamente';
  }
  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.detalleVenta.delete({ where: { id } });
    //Actualizar la venta restando el subtotal eliminado
    const detalleEliminado = await this.prisma.detalleVenta.findUnique({
      where: { id },
    });
    if (detalleEliminado) {
      const venta = await this.venta.findOne(detalleEliminado.ventaId);
      if (venta) {
        venta.total -= detalleEliminado.subtotal;
        await this.prisma.venta.update({
          where: { id: detalleEliminado.ventaId },
          data: { total: venta.total, fechaHora: DateTime.now().toJSDate() },
        });
      }
    }
    return 'Detalle de venta eliminado correctamente';
  }
}
