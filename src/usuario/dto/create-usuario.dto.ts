import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Rol } from '@prisma/client';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  correo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  dirEnvio: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({ required: true })
  contraseña: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  telefono: string;

  @ApiProperty({ required: false, default: Rol.CLIENTE })
  rol?: Rol = Rol.CLIENTE;
}
