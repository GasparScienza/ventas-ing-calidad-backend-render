import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { CreateDetalleVentaDto } from 'src/detalle-venta/dto/create-detalle-venta.dto';
import { DateTime } from 'luxon';

export class CreateVentaDto {
  @IsNotEmpty()
  @IsDate()
  @ApiProperty({ required: true })
  fechaHora: DateTime;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true })
  usuarioId: number;

  //Array de detalles de venta
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ required: true, type: [CreateDetalleVentaDto] })
  detalles: CreateDetalleVentaDto[];

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true })
  total: number;
}
