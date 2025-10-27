import { ApiProperty } from "@nestjs/swagger";

export class DetalleVenta {
    @ApiProperty()
    id: number;
    @ApiProperty()
    cantidad: number;
    @ApiProperty()
    subtotal: number
    @ApiProperty()
    productoId: number;
    @ApiProperty()
    ventaId: number;
}
