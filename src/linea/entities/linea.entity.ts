import { ApiProperty } from '@nestjs/swagger';

export class Linea {
  @ApiProperty()
  id: number;
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  descripcion: string;
  @ApiProperty()
  marcaId: number;
}
