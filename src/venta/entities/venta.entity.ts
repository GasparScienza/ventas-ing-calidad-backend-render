import { ApiProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';

export class Venta {
  @ApiProperty()
  id: number;
  @ApiProperty({ format: 'date-time', example: DateTime.now().toISO() })
  fechaHora: DateTime;
  @ApiProperty()
  total: number;
  @ApiProperty()
  usuarioId: number;
}
