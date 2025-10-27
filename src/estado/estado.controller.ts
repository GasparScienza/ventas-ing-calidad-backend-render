import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EstadoService } from './estado.service';

@Controller('estado')
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}
  @Get()
  findAll() {
    return this.estadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estadoService.findOne(id);
  }
}
