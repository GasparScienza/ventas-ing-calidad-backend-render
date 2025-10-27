import { Injectable } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ProveedorService {
  constructor(private prisma: PrismaService) { }

  async create(createProveedorDto: CreateProveedorDto) {
    return await this.prisma.proveedor.create({ data: createProveedorDto });
  }

  async findAll() {
    const proveedores = await this.prisma.proveedor.findMany({
      select: {
        id: true,
        nombre: true,
        direccion: true,
        telefono: true,
      },
    });
    if (proveedores.length === 0) {
      return { message: 'No hay proveedores registrados' };
    }
    return proveedores;
  }

  async findOne(id: number) {
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        direccion: true,
        telefono: true,
      },
    });
    if (!proveedor) {
      throw new HttpException('El proveedor no existe', HttpStatus.NOT_FOUND);
    }
    return proveedor;
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto) {
    await this.findOne(id);
    await this.prisma.proveedor.update({
      where: { id },
      data: updateProveedorDto,
    });
    return 'Proveedor actualizado correctamente';
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.proveedor.delete({
      where: { id },
    });
    return 'Proveedor eliminado correctamente';
  }

}
