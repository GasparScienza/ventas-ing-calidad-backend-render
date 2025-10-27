import { ApiProperty } from '@nestjs/swagger';
import { Rol } from '@prisma/client';

export class Usuario {
  @ApiProperty()
  id: number;
  @ApiProperty()
  correo: string;
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  telefono: string;
  @ApiProperty()
  dirEnvio: string;
  @ApiProperty()
  fechaHora: Date;
  @ApiProperty()
  rol: Rol;
}
