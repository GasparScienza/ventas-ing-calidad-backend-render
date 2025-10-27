import { PartialType } from '@nestjs/swagger';
import { CreateHistorialSesionDto } from './create-historial-sesion.dto';

export class UpdateHistorialSesionDto extends PartialType(CreateHistorialSesionDto) {}
