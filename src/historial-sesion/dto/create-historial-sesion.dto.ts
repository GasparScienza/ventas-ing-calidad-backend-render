import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHistorialSesionDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  usuarioId: number;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  fechaHora: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  accion: string;
}
