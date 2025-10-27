import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EstadoService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.estado.findMany();
  }

  findOne(id: number) {
    return this.prisma.estado.findUnique({
      where: { id },
    });
  }
}
