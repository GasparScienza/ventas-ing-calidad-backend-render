import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLineaDto {
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
  @ApiProperty({ required: true })
  marcaId: number;
}
