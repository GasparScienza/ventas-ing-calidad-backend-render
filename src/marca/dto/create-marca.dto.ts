import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMarcaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  nombre: string;

  @IsString()
  @ApiProperty({ required: false })
  descripcion: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  estadoId: number;
}
