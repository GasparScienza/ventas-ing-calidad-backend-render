import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const emailDup = await this.prisma.usuario.findUnique({
      where: { correo: createUsuarioDto.correo },
    });
    const phoneDup = await this.prisma.usuario.findUnique({
      where: { telefono: createUsuarioDto.telefono },
    });
    if (emailDup) {
      throw new HttpException(
        'No se pudo crear el usuario. Verifica los datos e intenta nuevamente.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (phoneDup) {
      throw new HttpException(
        'El telefono ya esta registrado',
        HttpStatus.BAD_REQUEST,
      );
    }
    const password = createUsuarioDto.contraseña;
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    await this.prisma.usuario.create({
      data: {
        correo: createUsuarioDto.correo,
        dirEnvio: createUsuarioDto.dirEnvio,
        contraseña: hash,
        nombre: createUsuarioDto.nombre,
        rol: createUsuarioDto.rol,
        telefono: createUsuarioDto.telefono,
      },
    });
    return 'Usuario creado correctamente';
  }

  findAll() {
    const usuarios = this.prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        correo: true,
        telefono: true,
        dirEnvio: true,
        rol: true,
      },
    });
    return usuarios;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
