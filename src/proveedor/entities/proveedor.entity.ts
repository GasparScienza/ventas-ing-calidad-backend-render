
import { ApiProperty } from "@nestjs/swagger";

export class Proveedor {
    @ApiProperty()
    id: number;
    @ApiProperty()
    nombre: string
    @ApiProperty()
    telefono: string
    @ApiProperty()
    direccion: string;
    @ApiProperty()
    contacto: string;
}