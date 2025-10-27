import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateProveedorDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    direccion: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    telefono: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    contacto: string;
}
