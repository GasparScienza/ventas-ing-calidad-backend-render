import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, default: 0 })
  stock: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @ApiProperty({ required: true })
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  lineaId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  proveedorId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  estadoId: number;
}
