import { ApiProperty } from '@nestjs/swagger';

export class Marca {
  @ApiProperty()
  id: number;
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  descripcion: string;
  @ApiProperty()
  estadoId: number;
}
