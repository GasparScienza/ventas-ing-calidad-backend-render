import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Request } from 'express';

@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) { }

  @Post()
  create(@Body() createVentaDto: CreateVentaDto, @Req() req: Request) {
    return this.ventaService.create(createVentaDto, req);
  }

  @Get()
  findAll() {
    return this.ventaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ventaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventaService.update(id, updateVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req: Request) {
    return this.ventaService.remove(id, req);
  }
}
