import { LoginDto } from './dto/login-dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from 'src/usuario/usuario.service';
import { HistorialSesionService } from 'src/historial-sesion/historial-sesion.service';
import { Request } from 'express';
import { Payload } from './entities/payload.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly usuarioSvc: UsuarioService,
    private readonly historialSvc: HistorialSesionService,
  ) {}

  // Validar usuario y generar token JWT
  async validateUser(loginDto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo: loginDto.correo },
    });
    // Usuario no encontrado
    if (!usuario) {
      throw new HttpException(
        'Correo o contraseña incorrectos',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isMatch = await bcrypt.compare(
      loginDto.contraseña,
      usuario.contraseña,
    );
    // Contraseña correcta
    if (isMatch) {
      await this.historialSvc.create({
        usuarioId: usuario.id,
        fechaHora: new Date(),
        accion: 'Inicio de sesión',
      });
      return this.jwtService.sign({
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        rol: usuario.rol,
      });
    } else {
      throw new HttpException(
        'Correo o contraseña incorrectos',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async registerUser(registerDto: CreateUsuarioDto) {
    await this.usuarioSvc.create(registerDto);
    const postValues = {
      correo: registerDto.correo,
      contraseña: registerDto.contraseña,
    };
    const userToken = await this.validateUser(postValues);

    return userToken;
  }

  getProfile(req: Request) {
    const authHeader = req.headers.authorization;

    // Validamos que el header exista y sea string
    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Token no proporcionado');
    }

    // Extraemos el token después de "Bearer "
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    try {
      const payload: Payload = this.jwtService.verify(token);
      return payload;
    } catch (e) {
      console.error('Error al verificar el token:', e);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
