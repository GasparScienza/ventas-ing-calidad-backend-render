import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistorialSesionService } from 'src/historial-sesion/historial-sesion.service';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { Payload } from 'src/auth/entities/payload.entity';

@Injectable()
export class LineaService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private historialService: HistorialSesionService,
  ) {}

  async create(createLineaDto: CreateLineaDto, req: Request) {
    try {
      await this.prisma.linea.create({ data: createLineaDto });
      const user: Payload = this.authService.getProfile(req);
      await this.historialService.create({
        usuarioId: user.id,
        fechaHora: new Date(),
        accion: 'Crear linea',
      });
      return 'Linea Creada correctamente';
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Hubo un error al crear la linea',
        HttpStatus.NOT_FOUND,
        {
          cause: error,
        },
      );
    }
  }

  async findAll() {
    const lineas = await this.prisma.linea.findMany({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        marca: { select: { id: true, nombre: true } },
      },
    });
    if (lineas.length === 0) {
      return { message: 'No hay lineas registradas' };
    }
    return lineas;
  }

  async findOne(id: number) {
    const linea = await this.prisma.linea.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        marca: { select: { id: true, nombre: true } },
      },
    });
    if (!linea) {
      throw new HttpException('La linea no existe', HttpStatus.NOT_FOUND);
    }
    return linea;
  }

  async update(id: number, updateLineaDto: UpdateLineaDto, req: Request) {
    await this.findOne(id);
    await this.prisma.linea.update({
      where: { id },
      data: updateLineaDto,
    });
    const user: Payload = this.authService.getProfile(req);
    await this.historialService.create({
      usuarioId: user.id,
      fechaHora: new Date(),
      accion: 'Actualizar linea',
    });

    return 'Linea actualizada correctamente';
  }

  async remove(id: number, req: Request) {
    await this.findOne(id);
    await this.prisma.linea.delete({
      where: { id },
    });
    const user: Payload = this.authService.getProfile(req);
    await this.historialService.create({
      usuarioId: user.id,
      fechaHora: new Date(),
      accion: 'Eliminar linea',
    });

    return 'Linea eliminada correctamente';
  }
}
