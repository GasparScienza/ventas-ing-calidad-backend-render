import { ApiProperty } from '@nestjs/swagger';

export class HistorialSesion {
  @ApiProperty()
  id: number;

  @ApiProperty()
  usuarioId: number;

  @ApiProperty()
  fechaHora: Date;

  @ApiProperty()
  accion: string;
}
