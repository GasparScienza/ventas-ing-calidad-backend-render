import { Injectable } from '@nestjs/common';
import { CreateHistorialSesionDto } from './dto/create-historial-sesion.dto';
import { UpdateHistorialSesionDto } from './dto/update-historial-sesion.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HistorialSesionService {
  constructor(private prisma: PrismaService) {}
  async create(createHistorialSesionDto: CreateHistorialSesionDto) {
    await this.prisma.historialSesion.create({
      data: createHistorialSesionDto,
    });
    return 'Historial de sesión creado';
  }

  async findAll() {
    return this.prisma.historialSesion.findMany();
  }

  async findOne(id: number) {
    return this.prisma.historialSesion.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateHistorialSesionDto: UpdateHistorialSesionDto) {
    await this.prisma.historialSesion.update({
      where: { id },
      data: updateHistorialSesionDto,
    });
    return `Historial de sesión actualizado`;
  }

  async remove(id: number) {
    await this.prisma.historialSesion.delete({
      where: { id },
    });
    return `Historial de sesión eliminado`;
  }
}
