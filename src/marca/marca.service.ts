import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { Payload } from 'src/auth/entities/payload.entity';
import { HistorialSesionService } from 'src/historial-sesion/historial-sesion.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MarcaService {
  constructor(
    private prisma: PrismaService,
    private historialService: HistorialSesionService,
    private authService: AuthService,
  ) {}
  async create(createMarcaDto: CreateMarcaDto, req: Request) {
    // Buscamos el estado Disponible de Marca y se lo asignamos por defecto al crear la misma
    const estado = await this.prisma.estado.findFirst({
      where: { ambito: 'MARCA', nombre: 'DISPONIBLE' },
    });
    try {
      await this.prisma.marca.create({
        data: {
          descripcion: createMarcaDto.descripcion,
          nombre: createMarcaDto.nombre,
          estadoId: estado!.id,
        },
      });
      const user: Payload = this.authService.getProfile(req);
      await this.historialService.create({
        usuarioId: user.id,
        fechaHora: new Date(),
        accion: 'Crear marca',
      });
      return 'Marca creada correctamente';
    } catch (error) {
      throw new HttpException('Error al crear la marca', HttpStatus.NOT_FOUND, {
        cause: error,
      });
    }
  }

  async findAll() {
    const marcas = await this.prisma.marca.findMany({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        estado: { select: { id: true, nombre: true } },
      },
    });
    if (!marcas) {
      throw new HttpException('No hay marcas', HttpStatus.NOT_FOUND);
    }
    return marcas;
  }

  async findOne(id: number) {
    const marca = await this.prisma.marca.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        estado: { select: { id: true, nombre: true } },
      },
    });
    if (!marca) {
      throw new HttpException('Marca no encontrada', HttpStatus.NOT_FOUND);
    }
    return marca;
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    await this.findOne(id);
    // Solo deja actualizar estados de ambito Marca
    const estados = await this.prisma.estado.findMany({
      where: { ambito: 'MARCA' },
    });
    // Si no se encuentra el estado dentro de los estados de Marca salta una excepcion
    if (
      updateMarcaDto.estadoId &&
      !estados.find((estado) => estado.id === updateMarcaDto.estadoId)
    ) {
      throw new HttpException('Estado no encontrado', HttpStatus.NOT_FOUND);
    }
    try {
      await this.prisma.marca.update({
        where: { id },
        data: updateMarcaDto,
      });
      return 'Marca actualizada correctamente';
    } catch (error) {
      throw new HttpException(
        'Error al actualizar la marca',
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }
  // Este metodo solo cambia el estado de marca a eliminada
  async remove(id: number, req: Request) {
    const marca = await this.findOne(id);
    if (marca.estado.nombre === 'ELIMINADA') {
      throw new HttpException('Marca ya eliminada', HttpStatus.NOT_FOUND);
    }

    const estado = await this.prisma.estado.findFirst({
      where: { ambito: 'MARCA', nombre: 'ELIMINADA' },
    });

    try {
      await this.prisma.marca.update({
        where: { id },
        data: { estadoId: estado!.id },
      });
      const user: Payload = this.authService.getProfile(req);
      await this.historialService.create({
        usuarioId: user.id,
        fechaHora: new Date(),
        accion: 'Eliminar marca',
      });
      return 'Marca eliminada correctamente';
    } catch (error) {
      throw new HttpException(
        'Error al eliminar la marca',
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }
}
