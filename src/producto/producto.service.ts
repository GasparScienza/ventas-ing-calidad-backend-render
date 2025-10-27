import { AuthService } from './../auth/auth.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistorialSesionService } from 'src/historial-sesion/historial-sesion.service';
import { Request } from 'express';
import { Payload } from 'src/auth/entities/payload.entity';

@Injectable()
export class ProductoService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private historialService: HistorialSesionService,
  ) {}
  async create(createProductoDto: CreateProductoDto, req: Request) {
    //Crear producto con estado por defecto 'DISPONIBLE'
    const estado = await this.prisma.estado.findFirst({
      where: { nombre: 'DISPONIBLE', ambito: 'PRODUCTO' },
    });
    createProductoDto.estadoId = estado!.id;
    await this.prisma.producto.create({ data: createProductoDto });
    const user: Payload = this.authService.getProfile(req);
    await this.historialService.create({
      usuarioId: user.id,
      fechaHora: new Date(),
      accion: 'Crear producto',
    });
    return 'Producto creado correctamente';
  }

  async findAll() {
    const productos = await this.prisma.producto.findMany({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio: true,
        linea: { select: { id: true, nombre: true } },
      },
    });
    if (productos.length === 0) {
      return { message: 'No hay productos registrados' };
    }
    return productos;
  }
  async findOne(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio: true,
        linea: { select: { id: true, nombre: true } },
        estado: { select: { id: true, nombre: true } },
      },
    });
    if (!producto) {
      throw new HttpException('El producto no existe', HttpStatus.NOT_FOUND);
    }
    return producto;
  }
  async update(id: number, updateProductoDto: UpdateProductoDto) {
    await this.findOne(id);
    //Solo deja actualizar estados de ambito Producto
    const estado = await this.prisma.estado.findMany({
      where: { ambito: 'PRODUCTO' },
    });
    await this.prisma.producto.update({
      where: { id },
      data: updateProductoDto,
    });
    if (
      updateProductoDto.estadoId &&
      !estado.find((estado) => estado.id === updateProductoDto.estadoId)
    ) {
      throw new HttpException('Estado no permitido', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.prisma.producto.update({
        where: { id },
        data: updateProductoDto,
      });
      return 'Producto actualizado correctamente';
    } catch (error) {
      throw new HttpException(
        'Error al actualizar el producto',
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }
  //Este metodo solo cambia el estado de producto a eliminado
  async remove(id: number, req: Request) {
    const producto = await this.findOne(id);
    if (producto.estado.nombre === 'ELIMINADO') {
      throw new HttpException(
        'El producto ya fue eliminado',
        HttpStatus.NOT_FOUND,
      );
    }
    const estado = await this.prisma.estado.findFirst({
      where: { nombre: 'ELIMINADO', ambito: 'PRODUCTO' },
    });

    try {
      await this.prisma.producto.update({
        where: { id },
        data: { estadoId: estado!.id },
      });
      const user: Payload = this.authService.getProfile(req);
      await this.historialService.create({
        usuarioId: user.id,
        fechaHora: new Date(),
        accion: 'Eliminar producto',
      });
      return 'Producto eliminado correctamente';
    } catch (error) {
      throw new HttpException(
        'Error al eliminar el producto',
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }
}
