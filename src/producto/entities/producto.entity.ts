import { ApiProperty } from '@nestjs/swagger';
import { Proveedor } from '../../proveedor/entities/proveedor.entity';
import { Linea } from '../../linea/entities/linea.entity';

export class Producto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    nombre: string;
    @ApiProperty()
    descripcion: string;
    @ApiProperty()
    precio: number;
    @ApiProperty()
    stock: number;
    @ApiProperty()
    lineaId: number;
    @ApiProperty()
    proveedorId: number;
}

