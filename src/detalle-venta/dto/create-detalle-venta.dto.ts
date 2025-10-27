import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateDetalleVentaDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    cantidad: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    subtotal: number;


    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    ventaId: number;


    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    productoId: number;
}
